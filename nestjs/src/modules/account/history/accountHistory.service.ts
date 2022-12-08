import {Injectable} from '@nestjs/common';
import {CursorSelectListResponseType} from "../../../common/type/type";
import {AccountEntity} from "../entities/account.entity";
import {CreateAccountHistoryDto} from "./dto/create-accountHistory-dto";
import {UpdateAccountHistoryDto} from "./dto/update-accountHistory-dto";
import {Connection, DeleteResult, UpdateResult} from "typeorm";
import {Message} from "../../../../libs/message";
import {InjectRepository} from "@nestjs/typeorm";
import {AccountHistoryRepository} from "./accountHistory.repository";
import {AccountHistoryEntity} from "./entities/accountHistory.entity";
import {AccountService} from "../account.service";
import {AccountHistoryCategoryRepository} from "./category/accountHistoryCategory.repository";
import {AccountHistoryCategoryEntity} from "./category/entities/accountHistoryCategory.entity";
import {MemberEntity} from "../../member/entities/member.entity";

@Injectable()
export class AccountHistoryService {
    constructor(
        @InjectRepository(AccountHistoryRepository) private readonly accountHistoryRepository: AccountHistoryRepository,
        @InjectRepository(AccountHistoryCategoryRepository) private readonly accountHistoryCategoryRepository: AccountHistoryCategoryRepository,
        private readonly accountService: AccountService,
        private readonly connection: Connection
    ) {
    }

    async selectOne(account: AccountEntity, accountHistoryIdx: number): Promise<AccountHistoryEntity> {
        return await this.accountHistoryRepository.selectOne(account, accountHistoryIdx);
    }

    async selectList(
        member: MemberEntity,
        multipleAccountIdx: string,
        type: number,
        startCursor: number,
        count: number,
        multipleAccountHistoryCategoryIdx?: string
    ): Promise<CursorSelectListResponseType<AccountHistoryEntity>> {
        const accountIdxList = multipleAccountIdx ?
            multipleAccountIdx.replace(/\s/g, '').split(',')
                .filter(v => v !== "") : undefined;
        const categoryIdxList = multipleAccountHistoryCategoryIdx ?
            multipleAccountHistoryCategoryIdx.replace(/\s/g, '').split(',')
                .filter(v => v !== "") : undefined;

        if(accountIdxList){
            for(const a of accountIdxList){
                if(isNaN(Number(a))) throw Message.WRONG_PARAM('account');

                const accountInfo = await this.accountService.selectOne(member, Number(a));

                if(!accountInfo){
                    throw Message.NOT_EXIST('account')
                }
            }
        }

        if (categoryIdxList) {
            for(const c of categoryIdxList) {
                if(isNaN(Number(c))) throw Message.WRONG_PARAM('category');

                const categoryInfo = await this.accountHistoryCategoryRepository
                    .selectOne(member, Number(c));

                if (!categoryInfo) {
                    throw Message.NOT_EXIST('category');
                }
            }
        }

        if (startCursor === -1) startCursor = undefined;

        const result = await this.accountHistoryRepository.selectList(
            accountIdxList, type, startCursor, count, categoryIdxList
        );

        return {
            items: result[0],
            startCursor,
            count,
            totalCount: result[1],
            last: Math.ceil(result[1] / count) || 1
        };
    }

    async create(account: AccountEntity, createAccountHistoryDto: CreateAccountHistoryDto): Promise<AccountHistoryEntity> {
        const categoryInfo: AccountHistoryCategoryEntity =
            await this.accountHistoryCategoryRepository
                .selectOne(account.member, createAccountHistoryDto.accountHistoryCategoryIdx);

        if (!categoryInfo) {
            throw Message.NOT_EXIST('category');
        }

        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const accountHistory: AccountHistoryEntity = new AccountHistoryEntity();

        accountHistory.dataMigration(createAccountHistoryDto);
        accountHistory.account = account;
        accountHistory.accountHistoryCategory = categoryInfo;

        let insertedAccountHistory: AccountHistoryEntity;

        try {
            insertedAccountHistory = await this.accountHistoryRepository.createAccountHistory(queryRunner, accountHistory);

            await this.accountService.resetTotalAmount(queryRunner, account);

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }

        return insertedAccountHistory;
    }

    async update(accountHistory: AccountHistoryEntity, updateAccountHistoryDto: UpdateAccountHistoryDto): Promise<UpdateResult> {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        accountHistory.dataMigration(updateAccountHistoryDto);

        let updateResult: UpdateResult

        try {
            updateResult = await this.accountHistoryRepository.updateAccountHistory(accountHistory, updateAccountHistoryDto);

            if (updateResult.affected !== 1) {
                throw Message.SERVER_ERROR;
            }

            await this.accountService.resetTotalAmount(queryRunner, accountHistory.account);

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }

        return updateResult;
    }

    async delete(accountHistory: AccountHistoryEntity): Promise<DeleteResult> {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        let deleteResult: DeleteResult;

        try {
            deleteResult = await this.accountHistoryRepository.deleteAccountHistory(accountHistory);

            if (deleteResult.affected !== 1) {
                throw Message.SERVER_ERROR;
            }

            await this.accountService.resetTotalAmount(queryRunner, accountHistory.account);

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }

        return deleteResult;
    }

}

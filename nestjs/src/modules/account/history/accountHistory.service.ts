import {Injectable} from '@nestjs/common';
import {SelectListResponseType} from "../../../common/type/type";
import {AccountEntity} from "../entities/account.entity";
import {CreateAccountHistoryDto} from "./dto/create-accountHistory-dto";
import {UpdateAccountHistoryDto} from "./dto/update-accountHistory-dto";
import {Connection, DeleteResult, UpdateResult} from "typeorm";
import {Message} from "../../../../libs/message";
import {InjectRepository} from "@nestjs/typeorm";
import {AccountHistoryRepository} from "./accountHistory.repository";
import {AccountHistoryEntity} from "./entities/accountHistory.entity";
import {AccountService} from "../account.service";

@Injectable()
export class AccountHistoryService {
    constructor(
        @InjectRepository(AccountHistoryRepository) private readonly accountHistoryRepository: AccountHistoryRepository,
        private readonly accountService: AccountService,
        private readonly connection: Connection
    ) {
    }

    async selectOne(account: AccountEntity, accountHistoryIdx: number): Promise<AccountHistoryEntity> {
        return await this.accountHistoryRepository.selectOne(account, accountHistoryIdx);
    }

    async selectList(account: AccountEntity, page: number, count: number): Promise<SelectListResponseType<AccountHistoryEntity>> {
        const result = await this.accountHistoryRepository.selectList(account, page, count);

        return {
            items: result[0],
            page,
            count,
            totalCount: result[1],
            last: Math.ceil(result[1] / count) || 1
        };
    }

    async create(account: AccountEntity, createAccountHistoryDto: CreateAccountHistoryDto): Promise<AccountHistoryEntity> {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const accountHistory: AccountHistoryEntity = new AccountHistoryEntity();

        accountHistory.dataMigration(createAccountHistoryDto);
        accountHistory.account = account;

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

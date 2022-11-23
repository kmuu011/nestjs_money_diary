import {Injectable} from '@nestjs/common';
import {AccountHistoryCategoryRepository} from "./accountHistoryCategory.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, DeleteResult, UpdateResult} from "typeorm";
import {MemberEntity} from "../../../member/entities/member.entity";
import {AccountHistoryCategoryEntity} from "./entities/accountHistoryCategory.entity";
import {CreateAccountHistoryCategoryDto} from "./dto/create-accountHistoryCategory-dto";
import {UpdateAccountHistoryCategoryDto} from "./dto/update-accountHistoryCategory-dto";
import {Message} from "../../../../../libs/message";
import {createColor} from "../../../../../libs/utils";
import {AccountHistoryRepository} from "../accountHistory.repository";

@Injectable()
export class AccountHistoryCategoryService {
    constructor(
        @InjectRepository(AccountHistoryCategoryRepository) private readonly accountHistoryCategoryRepository: AccountHistoryCategoryRepository,
        @InjectRepository(AccountHistoryRepository) private readonly accountHistoryRepository: AccountHistoryRepository,
        private readonly connection: Connection,
    ) {
    }

    async duplicateChecker(
        member: MemberEntity,
        type: number,
        name: string
    ): Promise<{ isDuplicate: boolean }> {
        const categoryList = await this.accountHistoryCategoryRepository
            .selectList(
                member,
                type,
                name
            );

        return {
            isDuplicate: categoryList.length !== 0
        }
    }

    async arrangeOrder(
        member: MemberEntity,
        type: number,
        accountHistoryCategory?: AccountHistoryCategoryEntity,
        order?: number
    ): Promise<void> {
        const accountHistoryCategoryList = await this.accountHistoryCategoryRepository.selectList(member, type);
        let splicedAccountHistoryCategoryList = [...accountHistoryCategoryList];

        if (accountHistoryCategory) {
            const newList = [];

            const splicedAccountHistoryCategory = splicedAccountHistoryCategoryList
                .splice(
                    splicedAccountHistoryCategoryList.findIndex(v => v.idx === accountHistoryCategory.idx),
                    1
                );

            if (order === 1) {
                splicedAccountHistoryCategoryList.unshift(accountHistoryCategory);
            } else if (order === accountHistoryCategoryList.length) {
                splicedAccountHistoryCategoryList.push(accountHistoryCategory);
            } else {
                for (let i = 0; i < splicedAccountHistoryCategoryList.length; i++) {
                    if (newList.length + 1 === order) {
                        newList.push(splicedAccountHistoryCategory[0]);
                    }
                    newList.push(splicedAccountHistoryCategoryList[i]);
                }
                splicedAccountHistoryCategoryList = newList;
            }
        }

        for (let i = 0; i < splicedAccountHistoryCategoryList.length; i++) {
            splicedAccountHistoryCategoryList[i].order = i + 1;

            const updateResult: UpdateResult = await this.accountHistoryCategoryRepository
                .updateAccountHistoryCategory(splicedAccountHistoryCategoryList[i], splicedAccountHistoryCategoryList[i]);

            if (updateResult.affected !== 1) {
                throw Message.SERVER_ERROR;
            }
        }
    }

    async selectOne(
        member: MemberEntity,
        accountHistoryCategoryIdx: number
    ): Promise<AccountHistoryCategoryEntity> {
        return await this.accountHistoryCategoryRepository.selectOne(member, accountHistoryCategoryIdx);
    }

    async selectList(
        member: MemberEntity,
        type: number
    ): Promise<AccountHistoryCategoryEntity[]> {
        return await this.accountHistoryCategoryRepository.selectList(member, type);
    }

    async create(
        member: MemberEntity,
        createAccountHistoryCategoryDto: CreateAccountHistoryCategoryDto
    ): Promise<AccountHistoryCategoryEntity> {
        const accountHistoryCategory: AccountHistoryCategoryEntity = new AccountHistoryCategoryEntity();

        accountHistoryCategory.dataMigration(createAccountHistoryCategoryDto);
        accountHistoryCategory.member = member;
        accountHistoryCategory.color = createColor();
        accountHistoryCategory.order = (await this.accountHistoryCategoryRepository
            .selectList(member, accountHistoryCategory.type)).length + 1;

        await this.arrangeOrder(
            member,
            accountHistoryCategory.type
        );

        return await this.accountHistoryCategoryRepository
            .createAccountHistoryCategory(
                undefined,
                accountHistoryCategory
            );
    }

    async update(
        accountHistoryCategory: AccountHistoryCategoryEntity,
        updateAccountHistoryCategoryDto: UpdateAccountHistoryCategoryDto
    ): Promise<UpdateResult> {
        if (
            updateAccountHistoryCategoryDto?.name !== undefined
            &&
            accountHistoryCategory.name === '기타'
            &&
            (
                accountHistoryCategory.order !== updateAccountHistoryCategoryDto.order
                ||
                accountHistoryCategory.name !== updateAccountHistoryCategoryDto.name
            )
        ) {
            throw Message.CUSTOM_ERROR('기본 카테고리는 변경할 수 없습니다.');
        }

        if (
            updateAccountHistoryCategoryDto?.name !== undefined
            &&
            accountHistoryCategory.name !== updateAccountHistoryCategoryDto.name
            &&
            (await this.duplicateChecker(
                accountHistoryCategory.member,
                accountHistoryCategory.type,
                updateAccountHistoryCategoryDto.name
            )).isDuplicate
        ) {
            throw Message.CUSTOM_ERROR('동일한 이름의 카테고리가 이미 존재합니다.');
        }

        const updateResult: UpdateResult = await this.accountHistoryCategoryRepository
            .updateAccountHistoryCategory(
                accountHistoryCategory,
                updateAccountHistoryCategoryDto
            );

        if (updateResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        if (
            accountHistoryCategory.order !== updateAccountHistoryCategoryDto.order
            &&
            updateAccountHistoryCategoryDto.order !== undefined
        ) {
            await this.arrangeOrder(
                accountHistoryCategory.member,
                accountHistoryCategory.type,
                accountHistoryCategory,
                updateAccountHistoryCategoryDto.order
            );
        }

        return updateResult;
    }

    async delete(
        accountHistoryCategory: AccountHistoryCategoryEntity
    ): Promise<DeleteResult> {
        if (accountHistoryCategory.name === '기타') {
            throw Message.CUSTOM_ERROR('기본 카테고리는 삭제할 수 없습니다.');
        }

        const defaultCategoryInfo: AccountHistoryCategoryEntity =
            await this.accountHistoryCategoryRepository
                .selectOne(
                    accountHistoryCategory.member,
                    undefined,
                    accountHistoryCategory.type,
                    '기타'
                );

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let deleteResult: DeleteResult;
        try {
            const migrationCategoryAccountHistory: UpdateResult =
                await this.accountHistoryRepository
                    .migrationAccountHistoryCategory(
                        queryRunner,
                        accountHistoryCategory.member.idx,
                        accountHistoryCategory.idx,
                        defaultCategoryInfo.idx
                        );

            if(migrationCategoryAccountHistory.affected.constructor !== Number){
                throw Message.SERVER_ERROR;
            }

            deleteResult = await this.accountHistoryCategoryRepository
                .deleteAccountHistoryCategory(queryRunner, accountHistoryCategory);

            if (deleteResult.affected !== 1) {
                throw Message.SERVER_ERROR;
            }

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }

        await this.arrangeOrder(
            accountHistoryCategory.member,
            accountHistoryCategory.type
        );

        return deleteResult;
    }

}

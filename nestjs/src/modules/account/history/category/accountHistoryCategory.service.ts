import {Injectable} from '@nestjs/common';
import {AccountHistoryCategoryRepository} from "./accountHistoryCategory.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, UpdateResult} from "typeorm";
import {MemberEntity} from "../../../member/entities/member.entity";
import {AccountHistoryCategoryEntity} from "./entities/accountHistoryCategory.entity";
import {CreateAccountHistoryCategoryDto} from "./dto/create-accountHistoryCategory-dto";
import {UpdateAccountHistoryCategoryDto} from "./dto/update-accountHistoryCategory-dto";
import {Message} from "../../../../../libs/message";

@Injectable()
export class AccountHistoryCategoryService {
    constructor(
        @InjectRepository(AccountHistoryCategoryRepository) private readonly accountHistoryCategoryRepository: AccountHistoryCategoryRepository,
    ) {
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
        const updateResult: UpdateResult = await this.accountHistoryCategoryRepository
            .updateAccountHistoryCategory(
                accountHistoryCategory,
                updateAccountHistoryCategoryDto
            );

        if (updateResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        return updateResult;
    }

    async delete(
        accountHistoryCategory: AccountHistoryCategoryEntity
    ): Promise<DeleteResult> {
        const deleteResult: DeleteResult = await this.accountHistoryCategoryRepository
            .deleteAccountHistoryCategory(accountHistoryCategory);

        if (deleteResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        return deleteResult;
    }

}

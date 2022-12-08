import {
    DeleteResult,
    EntityRepository,
    QueryRunner,
    Repository,
    UpdateResult
} from "typeorm";
import {AccountHistoryEntity} from "./entities/accountHistory.entity";
import {getUpdateObject} from "../../../../libs/utils";
import {UpdateAccountHistoryDto} from "./dto/update-accountHistory-dto";
import {AccountEntity} from "../entities/account.entity";
import {MemberEntity} from "../../member/entities/member.entity";

@EntityRepository(AccountHistoryEntity)
export class AccountHistoryRepository extends Repository<AccountHistoryEntity> {
    async selectOne(account: AccountEntity, accountHistoryIdx: number): Promise<AccountHistoryEntity> {
        const query = this.createQueryBuilder('h')
            .where({account, idx: accountHistoryIdx})
            .leftJoinAndSelect('h.accountHistoryCategory', 'c')
            .select([
                'h.idx', 'h.content', 'h.amount', 'h.type',
                'c.idx', 'c.name',
                'h.createdAt', 'h.updatedAt'
            ])
            .getOne();

        return await query;
    }

    async selectList(
        member: MemberEntity,
        accountIdxList?: string[],
        type?: number,
        startCursor?: number,
        count?: number,
        categoryIdxList?: string[],
        date?: string
    ): Promise<[AccountHistoryEntity[], number]> {
        let query = this.createQueryBuilder('h')
            .leftJoinAndSelect('h.accountHistoryCategory', 'c')
            .leftJoinAndSelect('h.account', 'a')
            .leftJoin('a.member', 'm')
            .select([
                'h.idx', 'h.content', 'h.amount', 'h.type',
                'a.idx','a.accountName',
                'c.idx', 'c.name',
                'h.createdAt', 'h.updatedAt'
            ])
            .where("m.idx = :memberIdx", {memberIdx: member.idx})
            .orderBy('h.idx', 'DESC');

        if (count) {
            query = query
                .take(count);
        }

        if (accountIdxList) {
            query = query.andWhere("h.accountIdx IN (:accountIdxList)", {accountIdxList});
        }

        if (type) {
            query = query.andWhere("h.type = :type", {type});
        }

        if (categoryIdxList) {
            query = query.andWhere("h.accountHistoryCategoryIdx IN (:categoryIdxList)", {categoryIdxList});
        }

        if (date) {
            query = query.andWhere("DATE_FORMAT(h.createdAt, '%Y%m%d') = :date", {date});
        }

        const totalCount = await query
            .getCount();

        if (startCursor) {
            query = query.andWhere("h.idx < :startCursor", {startCursor});
        }

        const list = await query
            .getMany();

        return [list, totalCount];
    }

    async createAccountHistory(queryRunner: QueryRunner, accountHistory: AccountHistoryEntity): Promise<AccountHistoryEntity> {
        if (queryRunner) {
            return await queryRunner.manager.save(accountHistory);
        } else {
            return await this.save(accountHistory)
        }
    }

    async updateAccountHistory(accountHistory: AccountHistoryEntity, updateAccountHistoryDto: UpdateAccountHistoryDto): Promise<UpdateResult> {
        const obj = getUpdateObject(
            [
                "content", "amount", "type", "accountHistoryCategory", "createdAt"
            ],
            {
                ...updateAccountHistoryDto,
                accountHistoryCategory: {idx: updateAccountHistoryDto.accountHistoryCategoryIdx}
            },
            true
        );

        return await this.update(accountHistory.idx, obj);
    }

    async migrationAccountHistoryCategory(
        queryRunner: QueryRunner,
        memberIdx: number,
        categoryIdx: number,
        defaultCategoryIdx: number
    ): Promise<UpdateResult> {
        return await queryRunner
            .manager
            .createQueryBuilder()
            .update(AccountHistoryEntity)
            .set({accountHistoryCategory: {idx: defaultCategoryIdx}})
            .where(
                "accountIdx IN (SELECT idx FROM `account` WHERE memberIdx = :memberIdx) " +
                "AND accountHistoryCategoryIdx = :categoryIdx",
                {memberIdx: memberIdx, categoryIdx})
            .execute();
    }

    async deleteAccountHistory(accountHistory: AccountHistoryEntity): Promise<DeleteResult> {
        return await this.delete(accountHistory.idx);
    }

}
import {
    Between,
    DeleteResult,
    EntityRepository, MoreThan,
    QueryRunner,
    Repository, SelectQueryBuilder,
    UpdateResult
} from "typeorm";
import {getUpdateObject} from "../../../libs/utils";
import {AccountEntity} from "./entities/account.entity";
import {MemberEntity} from "../member/entities/member.entity";
import {AccountIncomeOutcomeType} from "../../common/type/type";
import {AccountDailyCostSummaryType, AccountMonthCostSummaryType} from "./type/type";

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
    async selectMultiple(member: MemberEntity, accountIdxList: number[]): Promise<AccountEntity[]> {
        const query = this.createQueryBuilder('a')
            .where("a.memberIdx = :memberIdx", {memberIdx: member.idx})
            .andWhere("a.idx IN (:accountIdxList)", {accountIdxList});

        return query.getMany();
    }

    async selectMonthDailySummary(
        member: MemberEntity,
        startDate: string,
        endDate: string,
        accountIdxList?: number[]
    ): Promise<AccountDailyCostSummaryType[]> {
        let query = this.createQueryBuilder('a')
            .innerJoin('a.accountHistoryList', 'h')
            .select("DATE_FORMAT(h.createdAt, '%Y%m%d')", 'date')
            .addSelect("SUM(IF(h.type = 0, h.amount, 0))", 'outcome')
            .addSelect("SUM(IF(h.type = 1, h.amount, 0))", 'income')
            .where("a.memberIdx = :memberIdx", {memberIdx: member.idx})
            .andWhere("DATE_FORMAT(h.createdAt, '%Y%m%d') >= :startDate", {startDate})
            .andWhere("DATE_FORMAT(h.createdAt, '%Y%m%d') <= :endDate", {endDate})
            .groupBy("date")
            .orderBy("`date`");

        if(accountIdxList){
            query = query.andWhere("a.idx IN (:accountIdxList)", {accountIdxList});
        }

        return await query.getRawMany();
    }

    async selectMonthCostSummary(
        member: MemberEntity,
        yearMonth: string,
        accountIdxList?: number[],
    ): Promise<AccountMonthCostSummaryType> {
        const query = this.createQueryBuilder('a')
            .innerJoin('a.accountHistoryList', 'h')
            .select("SUM(IF(h.type = 0, h.amount, 0))", 'outcome')
            .addSelect("SUM(IF(h.type = 1, h.amount, 0))", 'income')
            .where("a.memberIdx = :memberIdx", {memberIdx: member.idx})
            .andWhere("DATE_FORMAT(h.createdAt, '%Y%m') = :yearMonth", {yearMonth})

        if(accountIdxList){
            query.andWhere("a.idx IN (:accountIdxList)", {accountIdxList});
        }

        return await query.getRawOne();
    }

    async selectOne(member: MemberEntity, accountIdx: number): Promise<AccountEntity> {
        return await this.findOne({
            where: {member, idx: accountIdx}
        });
    }

    async selectList(
        member: MemberEntity,
        startCursor?: number,
        endCursor?: number,
        count?: number
    ): Promise<[AccountEntity[], number]> {
        startCursor = startCursor || 0;

        const where = {
            member,
            order: MoreThan(startCursor)
        };

        if (endCursor) {
            where.order = Between(startCursor, endCursor);
        }

        let query: SelectQueryBuilder<AccountEntity> =
            this.createQueryBuilder('a')
                .orderBy('`order`', "ASC");

        if (!endCursor && count) {
            query = query.take(count);
        }

        const list = await query
            .where(where)
            .getMany();

        delete where.order;

        const totalCount = await query
            .where(where)
            .getCount();

        return [list, totalCount]
    }

    async selectTotalIncomeOutcome(
        queryRunner: QueryRunner,
        member: MemberEntity,
        accountIdx: number
    ): Promise<AccountIncomeOutcomeType> {
        const queryBuilder: SelectQueryBuilder<AccountEntity>
            = queryRunner ? queryRunner.manager.createQueryBuilder(AccountEntity, 'a', queryRunner)
            : this.createQueryBuilder('a');

        const finalQuery = queryBuilder
            .leftJoinAndSelect('a.accountHistoryList', 'h')
            .where("a.memberIdx = :memberIdx " +
                "AND h.accountIdx = :accountIdx", {memberIdx: member.idx, accountIdx})
            .select("SUM(IF(h.type = 0, h.amount, 0))", "outcome")
            .addSelect("SUM(IF(h.type = 1, h.amount, 0))", "income");

        return await finalQuery.getRawOne();
    }

    async selectTotalAmount(member: MemberEntity): Promise<number> {
        const queryBuilder: SelectQueryBuilder<AccountEntity> =
            this.createQueryBuilder('a')
                .where('a.memberIdx = :memberIdx ' +
                    'AND a.invisibleAmount = 0', {memberIdx: member.idx})
                .select("SUM(a.totalAmount)", "totalAmountOfAllAccount");

        return (await queryBuilder.getRawOne()).totalAmountOfAllAccount;
    }

    async createAccount(queryRunner: QueryRunner, account: AccountEntity): Promise<AccountEntity> {
        if (queryRunner) {
            return await queryRunner.manager.save(account);
        }

        return await this.save(account);
    }

    async updateAccount(queryRunner: QueryRunner, account: AccountEntity): Promise<UpdateResult> {
        const obj = getUpdateObject(
            ["accountName", "order", "invisibleAmount", "totalAmount"],
            account,
            true
        );

        if (queryRunner) {
            return await queryRunner.manager.update(AccountEntity, account.idx, obj);
        } else {
            return await this.update(account.idx, obj);
        }
    }

    async deleteAccount(account: AccountEntity): Promise<DeleteResult> {
        return await this.delete(account.idx);
    }

}
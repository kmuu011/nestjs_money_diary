import {
    DeleteResult,
    EntityRepository,
    FindOperator,
    LessThan,
    MoreThan,
    QueryRunner,
    Repository,
    UpdateResult
} from "typeorm";
import {AccountHistoryEntity} from "./entities/accountHistory.entity";
import {getUpdateObject} from "../../../../libs/utils";
import {UpdateAccountHistoryDto} from "./dto/update-accountHistory-dto";
import {AccountEntity} from "../entities/account.entity";
import {AccountHistoryCategoryEntity} from "./category/entities/accountHistoryCategory.entity";

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
        account: AccountEntity, type?: number, cursorIdx?: number, count?: number,
        category?: AccountHistoryCategoryEntity
    ): Promise<[AccountHistoryEntity[], number]> {
        let query = this.createQueryBuilder('h');

        const where: {
            account: AccountEntity,
            type?: number,
            accountHistoryCategory?: AccountHistoryCategoryEntity,
            idx?: FindOperator<number>
        } = {account};

        if (count) {
            query = query
                .take(count);
        }

        if (type) {
            where.type = type;
        }

        if (category) {
            where.accountHistoryCategory = category;
        }

        if (cursorIdx) {
            where.idx = LessThan(cursorIdx);
        }

        return await query
            .where(where)
            .leftJoinAndSelect('h.accountHistoryCategory', 'c')
            .select([
                'h.idx', 'h.content', 'h.amount', 'h.type',
                'c.idx', 'c.name',
                'h.createdAt', 'h.updatedAt'
            ])
            .orderBy('h.idx', 'DESC')
            .getManyAndCount();
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

    async deleteAccountHistory(accountHistory: AccountHistoryEntity): Promise<DeleteResult> {
        return await this.delete(accountHistory.idx);
    }

}
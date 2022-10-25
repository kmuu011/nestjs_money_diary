import {DeleteResult, EntityRepository, QueryRunner, Repository, UpdateResult} from "typeorm";
import {AccountHistoryEntity} from "./entities/accountHistory.entity";
import {getUpdateObject} from "../../../../libs/utils";
import {UpdateAccountHistoryDto} from "./dto/update-accountHistory-dto";
import {AccountEntity} from "../entities/account.entity";
import {AccountHistoryCategoryEntity} from "./category/entities/accountHistoryCategory.entity";

@EntityRepository(AccountHistoryEntity)
export class AccountHistoryRepository extends Repository<AccountHistoryEntity> {
    async selectOne(account: AccountEntity, accountHistoryIdx: number): Promise<AccountHistoryEntity> {
        return await this.findOne({
            where: {account, idx: accountHistoryIdx}
        });
    }

    async selectList(
        account: AccountEntity, type?: number, page?: number, count?: number,
        category?: AccountHistoryCategoryEntity
    ): Promise<[AccountHistoryEntity[], number]> {
        let query = this.createQueryBuilder('h');
        const where: {
            account: AccountEntity,
            type?: number,
            accountHistoryCategory?: AccountHistoryCategoryEntity
        } = {account};

        if (page && count) {
            query = query
                .skip((page - 1) * count)
                .take(count);
        }

        if (type) {
            where.type = type;
        }

        if (category) {
            where.accountHistoryCategory = category;
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
        const obj = getUpdateObject(["content", "amount", "type", "createdAt"], updateAccountHistoryDto, true);

        return await this.update(accountHistory.idx, obj);
    }

    async deleteAccountHistory(accountHistory: AccountHistoryEntity): Promise<DeleteResult> {
        return await this.delete(accountHistory.idx);
    }

}
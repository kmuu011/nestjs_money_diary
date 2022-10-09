import {DeleteResult, EntityRepository, Repository, UpdateResult} from "typeorm";
import {AccountHistoryEntity} from "./entities/accountHistory.entity";
import {getUpdateObject} from "../../../../libs/utils";
import {UpdateAccountHistoryDto} from "./dto/update-accountHistory-dto";
import {AccountEntity} from "../entities/account.entity";

@EntityRepository(AccountHistoryEntity)
export class AccountHistoryRepository extends Repository<AccountHistoryEntity> {

    async selectOne(account: AccountEntity, accountHistoryIdx: number): Promise<AccountHistoryEntity> {
        return await this.findOne({
            where: {account, idx: accountHistoryIdx}
        });
    }

    async selectList(account: AccountEntity, page?: number, count?: number): Promise<[AccountHistoryEntity[], number]> {
        let query = this.createQueryBuilder('t');

        if (page && count) {
            query = query
                .skip((page - 1)*count)
                .take(count);
        }

        return await query
            .where({account})
            .orderBy('createdAt', 'DESC')
            .getManyAndCount();
    }

    async createAccountHistory(accountHistory: AccountHistoryEntity): Promise<AccountHistoryEntity> {
        return await this.save(accountHistory)
    }

    async updateAccountHistory(accountHistory: AccountHistoryEntity, updateAccountHistoryDto: UpdateAccountHistoryDto): Promise<UpdateResult> {
        const obj = getUpdateObject(["content"], updateAccountHistoryDto, true);

        return await this.update(accountHistory.idx, obj);
    }

    async deleteAccountHistory(accountHistory: AccountHistoryEntity): Promise<DeleteResult> {
        return await this.delete(accountHistory.idx);
    }

}
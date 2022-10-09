import {DeleteResult, EntityRepository, QueryRunner, Repository, UpdateResult} from "typeorm";
import {getUpdateObject} from "../../../libs/utils";
import {AccountEntity} from "./entities/account.entity";
import {MemberEntity} from "../member/entities/member.entity";

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {

    async selectOne(member: MemberEntity, accountIdx: number): Promise<AccountEntity> {
        return await this.findOne({
            where: {member, idx: accountIdx}
        });
    }

    async selectList(member: MemberEntity, page?: number, count?: number): Promise<[AccountEntity[], number]> {
        let query = this.createQueryBuilder('a');

        if(page && count){
            query = query
                .skip((page-1)*count)
                .take(count);
        }

        return await query
            .where({member})
            .orderBy('`order`', "DESC")
            .getManyAndCount();
    }

    async createAccount(queryRunner: QueryRunner, account: AccountEntity): Promise<AccountEntity> {
        if(queryRunner){
            return await queryRunner.manager.save(account);
        }else {
            return await this.save(account);
        }
    }

    async updateAccount(account: AccountEntity): Promise<UpdateResult> {
        const obj = getUpdateObject(["title", "order"], account, true);

        return await this.update(account.idx, obj);
    }

    async deleteAccount(account: AccountEntity): Promise<DeleteResult> {
        return await this.delete(account.idx);
    }

}
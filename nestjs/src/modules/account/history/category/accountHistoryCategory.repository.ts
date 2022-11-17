import {DeleteResult, EntityRepository, QueryRunner, Repository, UpdateResult} from "typeorm";
import {AccountHistoryCategoryEntity} from "./entities/accountHistoryCategory.entity";
import {getUpdateObject} from "../../../../../libs/utils";
import {UpdateAccountHistoryCategoryDto} from "./dto/update-accountHistoryCategory-dto";
import {MemberEntity} from "../../../member/entities/member.entity";

@EntityRepository(AccountHistoryCategoryEntity)
export class AccountHistoryCategoryRepository extends Repository<AccountHistoryCategoryEntity> {
    async selectOne(
        member: MemberEntity,
        accountHistoryCategoryIdx: number
    ): Promise<AccountHistoryCategoryEntity> {
        return await this.findOne({
            where: {member, idx: accountHistoryCategoryIdx}
        });
    }

    async selectList(
        member: MemberEntity,
        type: number,
        name?: string
    ): Promise<AccountHistoryCategoryEntity[]> {
        const where:{
            member: MemberEntity,
            type: number,
            name?: string
        } = {
            member,
            type
        };

        if(name){
            where.name = name;
        }

        const query = this.createQueryBuilder('c');

        return await query
            .where(where)
            .orderBy('`order`', "ASC")
            .getMany();
    }

    async createAccountHistoryCategory(
        queryRunner: QueryRunner,
        accountHistoryCategory: AccountHistoryCategoryEntity
    ): Promise<AccountHistoryCategoryEntity> {
        if (queryRunner) {
            return await queryRunner.manager.save(accountHistoryCategory);
        } else {
            return await this.save(accountHistoryCategory)
        }
    }

    async updateAccountHistoryCategory(
        accountHistoryCategory: AccountHistoryCategoryEntity,
        updateAccountHistoryCategoryDto: UpdateAccountHistoryCategoryDto
    ): Promise<UpdateResult> {
        const obj = getUpdateObject(
            ["name", "color", "type", "order"],
            updateAccountHistoryCategoryDto,
            true
        );

        return await this.update(accountHistoryCategory.idx, obj);
    }

    async deleteAccountHistoryCategory(
        accountHistoryCategory: AccountHistoryCategoryEntity
    ): Promise<DeleteResult> {
        return await this.delete(accountHistoryCategory.idx);
    }

}
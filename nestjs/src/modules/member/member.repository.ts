import {MemberEntity} from "./entities/member.entity";
import {DeleteResult, EntityRepository, QueryRunner, Repository, UpdateResult} from "typeorm";
import {getUpdateObject} from "../../../libs/utils";

const memberSelectKeys: any = ["idx", "id", "nickname", "email", "admin", "profileImgKey", "authType", "ip", "userAgent", "createdAt", "updatedAt"];
const memberUpdateKeys: string[] = ["nickname", "email", "profileImgKey", "ip", "userAgent", "password"];

@EntityRepository(MemberEntity)
export class MemberRepository extends Repository<MemberEntity> {

    async select(member: MemberEntity, selectKeys?: string, includePassword?: boolean): Promise<MemberEntity> {
        if(selectKeys === undefined) selectKeys = "idx";
        const selectKeysList = selectKeys.replace(/\s/g, '').split(',');
        const where = {};

        for(const k of selectKeysList){
            where[k] = member[k];
        }

        const additionalKeys = [];

        if(includePassword === true){
            additionalKeys.push('password');
        }

        return await this.findOne({
            select: [...memberSelectKeys, ...additionalKeys],
            relations: ["tokenInfo"],
            where
        });
    }

    async signUp(queryRunner: QueryRunner, member: MemberEntity): Promise<MemberEntity> {
        if(queryRunner) {
            return await queryRunner.manager.save(member);
        }else{
            return await this.save(member);
        }
    }

    async updateMember(member: MemberEntity): Promise<UpdateResult> {
        const obj = getUpdateObject<MemberEntity>(memberUpdateKeys, member, true);

        return await this.update(member.idx, obj);
    }

    async duplicateCheck(type, value): Promise<MemberEntity> {
        return await this.findOne({
            [type]: value
        });
    }

    async signOut(member: MemberEntity): Promise<DeleteResult> {
        return await this.delete(member.idx);
    }
}
import {EntityRepository, Repository} from "typeorm";
import {TokenEntity} from "../entities/token.entity";
import {MemberEntity} from "../entities/member.entity";

@EntityRepository(TokenEntity)
export class TokenRepository extends Repository<TokenEntity> {

    async select(code: string, member: MemberEntity): Promise<TokenEntity> {
        const where: {code?: string, member?: MemberEntity} = {};

        if(code !== undefined){
            where.code = code;
        }

        if(member !== undefined){
            where.member = member;
        }

        return await this.findOne({
            relations: ["member"],
            where: where,
        });
    }

    async saveToken(token: TokenEntity): Promise<TokenEntity> {
        return await this.save(token);
    }

}
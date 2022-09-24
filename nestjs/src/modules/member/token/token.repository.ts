import {EntityRepository, Repository} from "typeorm";
import {Token} from "../entities/token.entity";
import {Member} from "../entities/member.entity";

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {

    async select(code: string, member: Member): Promise<Token> {
        const where: {code?: string, member?: Member} = {};

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

    async saveToken(token: Token): Promise<Token> {
        return await this.save(token);
    }

}
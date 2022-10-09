import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {MemberEntity} from "../../modules/member/entities/member.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Message} from "../../../libs/message";
import {TokenRepository} from "../../modules/member/token/token.repository";
import * as utils from "../../../libs/utils";
import {Request, Response} from "express";
import {auth, swagger} from "../../../config/config";
import {TokenEntity} from "../../modules/member/token/entities/token.entity";

const serverType = process.env.NODE_ENV;

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(TokenRepository) private tokenRepository: TokenRepository,
    ) {}

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        const now: number = Date.now();
        const req: Request = context.switchToHttp().getRequest();
        const res: Response = context.switchToHttp().getResponse();
        const { ip, "user-agent": userAgent, "token-code": tokenCode } = req.headers;

        const member: MemberEntity = new MemberEntity();

        const memberInfo = await this.tokenRepository.createQueryBuilder('t')
            .select([
                'm.idx', 'm.id', 'm.nickname', 'm.email', 'm.profileImgKey', 'm.createdAt',
                'm.ip', 'm.userAgent', 'm.authType', 'm.authId',
                't.idx', 't.code', 't.token'
            ])
            .leftJoin('t.member', 'm')
            .where('t.memberIdx = m.idx ' +
                'AND t.code = :code', {code: tokenCode})
            .getOne();

        if(memberInfo?.member?.id !== swagger.dummyUserInfo.id && (!memberInfo || (serverType !== 'localDevelopment' && (memberInfo.member.ip !== ip || memberInfo.member.userAgent !== userAgent)))){
            throw Message.UNAUTHORIZED;
        }

        member.dataMigration(memberInfo.member);

        member.tokenInfo = memberInfo;
        delete memberInfo.member;

        if(member.id === swagger.dummyUserInfo.id){
            req.locals.memberInfo = member;
            return true;
        }

        const jwtPayload = await member.decodeToken();

        if(jwtPayload.keepCheck === true && ((now-jwtPayload.time)/1000) > auth.tokenRefreshTime){
            member.dataMigration({
                keepCheck: jwtPayload.keepCheck
            });

            const token: TokenEntity = await this.tokenRepository.select(undefined, member);

            const newToken: string = member.createToken();
            const code: string = await utils.createKey<TokenRepository>(this.tokenRepository, 'code', 40);

            token.dataMigration({code, token: newToken});

            member.tokenInfo = await this.tokenRepository.saveToken(token);

            res.header('new-token-code', code);
        }

        req.locals.memberInfo = member;

        return true;
    }
}

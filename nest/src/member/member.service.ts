import {Injectable} from '@nestjs/common';
import {LoginMemberDto} from "./dto/login-member.dto";
import {Request} from "express";
import {MemberDao} from "./member.dao";
import {Member} from "./model/member.model";
import Organizer from "libs/organizer";

@Injectable()
export class MemberService {
    constructor(
        private readonly memberDao: MemberDao,
        private readonly member: Member,
    ) {}

    async login(req: Request, loginMemberDto: LoginMemberDto) {
        await loginMemberDto.passwordEncrypt();

        await this.member.dataMigration(loginMemberDto);

        const memberModel = await this.memberDao.login(loginMemberDto);

        await this.member.dataMigration(memberModel);
        await this.member.dataMigration({
            ip: req.headers.ip,
            user_agent: req.headers['user-agent']
        });

        await this.member.createToken();

        req.organizedSql = await Organizer.get_sql(this.member,
            'ip, user_agent', undefined, 2);

        await this.memberDao.update(req, this.member);

        return memberModel;
    }
}

import {Injectable} from '@nestjs/common';
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

    async login(req: Request, member: Member): Promise<Member> {
        member.passwordEncrypt();

        const memberModel = await this.memberDao.login(member);

        this.member.dataMigration(memberModel);
        this.member.dataMigration({
            ip: req.headers.ip,
            user_agent: req.headers['user-agent']
        });

        this.member.createToken();

        req.organizedSql = Organizer.getSql(this.member,
            'ip, user_agent', undefined, 2);

        await this.memberDao.update(req, this.member);

        return this.member;
    }
}

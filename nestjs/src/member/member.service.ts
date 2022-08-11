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

        req.organizedSql = Organizer.getSql(
            this.member, 'ip, user_agent', undefined,
            Organizer.timeAdditional.updateOnly);

        await this.memberDao.update(req, this.member);

        return this.member;
    }

    async signUp(req: Request, member: Member): Promise<void> {
        member.passwordEncrypt();

        req.organizedSql = Organizer.getSql(
            member, 'id, nickname, password, email', undefined,
            Organizer.timeAdditional.createAndUpdate);

        await this.memberDao.signUp(req, member);
    }

    async duplicateCheck(type: number, value: string) {
        return await this.memberDao.duplicateCheck(type, value);
    }

    async update(req: Request, member: Member): Promise<void> {
        req.organizedSql = Organizer.getSql(
            member, 'max_sale_keyword_cnt', undefined,
            Organizer.timeAdditional.updateOnly
        );

        await this.memberDao.update(req, member);
    }
}

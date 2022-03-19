import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {MemberService} from './member.service';
import {Request} from "express";
import {Message} from 'libs/message';
import db from "libs/db";

import {LoginMemberDto} from "./dto/login-member.dto";
import {CreateMemberDto} from "./dto/create-member-dto";
import {Member} from "./model/member.model";

@Controller('/member')
export class MemberController {
    constructor(
        private readonly memberService: MemberService,
        private readonly member: Member,
    ) {}

    @Post('/login')
    async login(@Req() req: Request, @Body() loginMemberDto: LoginMemberDto) {
        req.connector = await db.getConnection();

        this.member.dataMigration(loginMemberDto);

        const member = await this.memberService.login(req, this.member);

        await db.commit(req.connector);

        return {token: member.token};
    }

    @Post('/signUp')
    async signUp(@Req() req: Request, @Body() createMemberDto: CreateMemberDto) {
        req.connector = await db.getConnection();

        await db.commit(req.connector);

        return;
    }

}

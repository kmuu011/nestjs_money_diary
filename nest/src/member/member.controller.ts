import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {MemberService} from './member.service';
import {Request} from "express";
import {Message} from 'libs/message';

import {LoginMemberDto} from "./dto/login-member.dto";
import db from "libs/db";
import {Member} from "./model/member.model";

@Controller('/member')
export class MemberController {
    constructor(
        private readonly memberService: MemberService,
    ) {}

    @Post('/login')
    async login(@Req() req: Request, @Body() loginMemberDto: LoginMemberDto) {
        req.connector = await db.getConnection();

        const member = await this.memberService.login(req, loginMemberDto);

        await db.commit(req.connector);

        return {token: member.token};
    }

    @Post('/signUp')
    async login(@Req() req: Request, @Body() loginMemberDto: LoginMemberDto) {
        req.connector = await db.getConnection();

        const member = await this.memberService.login(req, loginMemberDto);

        await db.commit(req.connector);

        return {token: member.token};
    }

}

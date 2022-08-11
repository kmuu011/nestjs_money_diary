import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {MemberService} from './member.service';
import {Request} from "express";
import DB from "libs/db";

import {Member} from "./model/member.model";

import {LoginMemberDto} from "./dto/login-member.dto";
import {CreateMemberDto} from "./dto/create-member-dto";
import {DuplicateCheckMemberDto} from "./dto/duplicate-check-member.dto";
import {Message} from "libs/message";

const duplicateCheckKeys = ['id', 'nickname', 'email'];

@Controller('/member')
export class MemberController {
    constructor(
        private readonly memberService: MemberService,
        private readonly member: Member,
    ) {}

    @Post('/login')
    async login(
        @Req() req: Request,
        @Body() loginMemberDto: LoginMemberDto
    ) {
        req.connector = await DB.getConnection();

        this.member.dataMigration(loginMemberDto);

        await new Promise(async (resolve) => {
            setTimeout(() => {
                resolve('');
            }, 10000);
        });

        console.log(this.member)

        const member = await this.memberService.login(req, this.member);

        await DB.commit(req.connector);

        return {token: member.token};
    }

    @Post('/check')
    async check(
        @Req() req: Request,
    ) {
        console.log(this.member)

        await this.member.decodeToken()

        return true;
    }

    @Post('/signUp')
    async signUp(
        @Req() req: Request,
        @Body() createMemberDto: CreateMemberDto
    ) {
        for(let i=0 ; i<duplicateCheckKeys.length ; i ++){
            const duplicateCheckResult = await this.memberService.duplicateCheck(i, createMemberDto[duplicateCheckKeys[i]]);

            if(duplicateCheckResult.isDuplicate){
                throw Message.ALREADY_EXIST(duplicateCheckKeys[i]);
            }
        }

        this.member.dataMigration(createMemberDto);

        req.connector = await DB.getConnection();

        await this.memberService.signUp(req, this.member);

        await DB.commit(req.connector);

        console.log(this.member);

        return {result: true};
    }

    @Get('/duplicateCheck')
    async duplicateCheck(
        @Req() req: Request,
        @Body() duplicateCheckMemberDto: DuplicateCheckMemberDto
    ) {
        const { type, value } = duplicateCheckMemberDto;

        const result = await this.memberService.duplicateCheck(type, value);

        if(result.isDuplicate){
            throw Message.ALREADY_EXIST(duplicateCheckKeys[type]);
        }

        return {result: true};
    }

}

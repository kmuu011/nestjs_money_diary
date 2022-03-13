import {All, Body, Controller, Get, HttpException, HttpStatus, Post, Req} from '@nestjs/common';
import {MemberService} from './member.service';
import {NextFunction, Request} from "express";
import {Message} from 'libs/message';

import db from 'libs/db';


@Controller('/member')
export class MemberController {
    constructor(
        private readonly memberService: MemberService
    ) {}

    @Post('/login')
    async login(@Req() req: Request, @Body() body){
        // throw Message.SERVER_ERROR;
        let sql = "SELECT * FROM member WHERE id = 'test'";

        const result = await db.query(sql);

        return result;
    }

}

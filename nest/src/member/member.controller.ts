import {All, Body, Controller, Get, Next, Param, Post, Req} from '@nestjs/common';
import {MemberService} from './member.service';
import {NextFunction, Request} from "express";

@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Post('login')
    async login(@Req() req: Request, @Body() body){
        console.log(body);

        return req.body;
    }
}

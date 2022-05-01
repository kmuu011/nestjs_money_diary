import {Body, Controller, Get, Post, Req, UseGuards, UseInterceptors} from '@nestjs/common';
import {Request} from "express";
import {Message} from 'libs/message';

import DB from "libs/db";
import {TestInterceptor} from "intercetor/test.interceptor";
import {CreateMemberDto} from "../member/dto/create-member-dto";
import {AuthGuard} from "guard/auth.guard";


const mysql = require('mysql2');

function test <T> (obj: T): T {
    return obj;
}

@Controller('/test')
export class TestController <T> {

    @Get('promiseAll')
    async promiseAll(@Req() req: Request) {
        const a = test<object>({name: '미누'});
        const b = test<string>('raw');

        console.log(a);
        console.log(b);

        return true;
    }

    @Get('dbTest')
    async dbTest(@Req() req: Request) {

        await DB.query("SELECT updated_at FROM member WHERE id= 'tts'");

        return true;
    }

    @UseInterceptors(new TestInterceptor())
    @Post('/interceptor')
    async signUp(@Req() req: Request) {

        console.log('job1');

        return true;
    }

    @Post('/guard')
    @UseGuards(AuthGuard)
    async guard(@Req() req: Request) {

        console.log('guard');

        return true;
    }

}

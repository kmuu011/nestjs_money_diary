import {Body, Controller, Get, Post, Req, UseGuards, UseInterceptors} from '@nestjs/common';
import {Request} from "express";
import {Message} from 'libs/message';

import DB from "libs/db";
import {TestInterceptor} from "../../intercetor/test.interceptor";
import {CreateMemberDto} from "../member/dto/create-member-dto";

const mysql = require('mysql2');


@Controller('/test')
export class TestController {

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
    async guard(@Req() req: Request) {

        console.log('guard');

        return true;
    }

}

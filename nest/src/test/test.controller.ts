import {Body, Controller, Get, Post, Query, Req, UseGuards, UseInterceptors} from '@nestjs/common';
import {Request} from "express";
import {Message} from 'libs/message';

import DB from "libs/db";
import {TestInterceptor} from "intercetor/test.interceptor";
import {CreateMemberDto} from "../member/dto/create-member-dto";
import {AuthGuard} from "guard/auth.guard";

import {TestDto} from "./dto/test.dto";
import {TestRepository} from "./test.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Test} from "../../entities/test.entity";
import {TestSelectDto} from "./dto/test.selectDto";


const mysql = require('mysql2');

function test <T> (obj: T): T {
    return obj;
}

@Controller('/test')
export class TestController <T> {
    constructor(
        @InjectRepository(TestRepository) private testRepository: TestRepository
    ) {}

    @Get('promiseAll')
    async promiseAll(@Req() req: Request) {
        const a = test<object>({name: '미누'});
        const b = test<string>('raw');

        console.log(a);
        console.log(b);

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


    @Get('/select')
    async select(
        @Req() req: Request,
        @Query() testSelectDto: TestSelectDto
    ){

        const testList: Test[] = await this.testRepository.findAll(testSelectDto);
        console.log(testSelectDto)

        console.log(testList);

        return testList
    }

    @Post('/insert')
    async insert(
        @Req() req: Request,
        @Body() testDto: TestDto
    ){
        const test = await this.testRepository.onCreate(testDto);

        console.log(test);

        return true;
    }

}

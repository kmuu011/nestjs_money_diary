import {
    All,
    Body,
    Controller,
    Delete,
    Get,
    Next,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {NextFunction, Request} from "express";
import {Message} from 'libs/message';

import DB from "libs/db";
import {TestInterceptor} from "intercetor/test.interceptor";
import {CreateMemberDto} from "../member/dto/create-member-dto";
import {AuthGuard} from "guard/auth.guard";

import {TestDto} from "./dto/test.dto";
import {TestRepository} from "./test.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {TestSelectDto} from "./dto/test.selectDto";
import {TestDeleteDto} from "./dto/test.deleteDto";
import {DeleteResult} from "typeorm";
import {Test} from "./entities/test.entity";

const mysql = require('mysql2');

function test <T> (obj: T) {
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

        const testList: Test[] = await this.testRepository.select(testSelectDto);

        return testList;
    }

    @Post('/insert')
    async insert(
        @Req() req: Request,
        @Body() testDto: TestDto
    ){
        const test = await this.testRepository.onCreate(testDto);

        return true;
    }

    @All('/:idx(\\d+)')
    async check(
        @Req() req: Request,
        @Param() idx: number,
        @Next() next: NextFunction
    ){
        const test = await this.testRepository.selectOne(idx);

        console.log(test);
        next();
    }


    @Delete('/delete/:idx')
    async delete(
        @Req() req: Request,
        @Param() idx: number
    ){

        const result: DeleteResult = await this.testRepository.deleteTest(idx);

        return result;
    }

}

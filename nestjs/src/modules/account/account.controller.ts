import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards, UseInterceptors,
} from '@nestjs/common';
import {Request} from "express";
import {AuthGuard} from "../../common/guard/auth.guard";
import {MemberEntity} from "../member/entities/member.entity";
import {SelectQueryDto} from "../../common/dto/select-query-dto";
import {CursorSelectListResponseType, ResponseBooleanType, SelectListResponseType} from "../../common/type/type";
import {ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {ApiOkResponseSelectList} from "../../common/swagger/customDecorator";
import {swagger} from "../../../config/config";
import {AccountSelectResponse} from "./swagger/customResponse";
import {AccountService} from "./account.service";
import {AccountEntity} from "./entities/account.entity";
import {CreateAccountDto} from "./dto/create-account-dto";
import {UpdateAccountDto} from "./dto/update-account-dto";
import {AccountInterceptor} from "./account.interceptor";
import {CursorSelectQueryDto} from "../../common/dto/cursor-select-query-dto";

@Controller('/account')
@UseGuards(AuthGuard)
@ApiTags('Account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Get()
    @ApiOperation({ summary: '가계부 조회' })
    @ApiOkResponseSelectList(AccountSelectResponse, '가계부 조회 성공')
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    async selectAccountList(
        @Req() req: Request,
        @Query() query: CursorSelectQueryDto
    ): Promise<CursorSelectListResponseType<AccountEntity>> {
        const {cursor, count} = query;
        const member: MemberEntity = req.locals.memberInfo;

        return await this.accountService.selectList(member, cursor, count);
    }

    @Post()
    @ApiOperation({ summary: '가계부 등록' })
    @ApiCreatedResponse({
        description: '가계부 등록 성공',
        type: AccountEntity
    })
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    async createAccount(
        @Req() req: Request,
        @Body() body: CreateAccountDto
    ): Promise<AccountEntity> {
        const member: MemberEntity = req.locals.memberInfo;

        const todoGroup: AccountEntity = await this.accountService.create(member, body);

        delete todoGroup.member;

        return todoGroup;
    }

    @Get('/:accountIdx(\\d+)')
    @UseInterceptors(AccountInterceptor)
    @ApiOperation({ summary: '가계부 단일 조회' })
    @ApiOkResponse({
        description: '가계부 단일 조회',
        type: AccountEntity
    })
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    async selectOneAccount(
        @Req() req: Request,
        @Param('accountIdx') accountIdx: number,
    ): Promise<AccountEntity> {
        return req.locals.accountInfo;
    }

    @Patch('/:accountIdx(\\d+)')
    @UseInterceptors(AccountInterceptor)
    @ApiOperation({ summary: '가계부 수정' })
    @ApiOkResponse({
        description: '가계부 수정',
        type: ResponseBooleanType
    })
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    async updateAccount(
        @Req() req: Request,
        @Body() body: UpdateAccountDto,
        @Param('accountIdx') accountIdx: number,
    ): Promise<ResponseBooleanType> {
        const {memberInfo, accountInfo} = req.locals;

        await this.accountService.update(memberInfo, accountInfo, body);

        return {result: true};
    }

    @Delete('/:accountIdx(\\d+)')
    @UseInterceptors(AccountInterceptor)
    @ApiOperation({ summary: '가계부 삭제' })
    @ApiOkResponse({
        description: '가계부 삭제',
        type: ResponseBooleanType
    })
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    async deleteAccount(
        @Req() req: Request,
        @Param('accountIdx') accountIdx: number,
    ): Promise<ResponseBooleanType> {
        const {memberInfo, accountInfo} = req.locals;

        await this.accountService.delete(memberInfo, accountInfo);

        return {result: true};
    }

}

import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    Req,
    UseGuards, UseInterceptors,
} from '@nestjs/common';
import {AuthGuard} from "../../../common/guard/auth.guard";
import {Request} from "express";
import {AccountService} from "../account.service";
import {AccountEntity} from "../entities/account.entity";
import {CreateAccountHistoryDto} from "./dto/create-accountHistory-dto";
import {AccountHistoryEntity} from "./entities/accountHistory.entity";
import {UpdateAccountHistoryDto} from "./dto/update-accountHistory-dto";
import {CursorSelectListResponseType, ResponseBooleanType, SelectListResponseType} from "../../../common/type/type";

import {AccountHistoryInterceptor} from "./accountHistory.interceptor";
import {AccountInterceptor} from "../account.interceptor";
import {ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import {ApiOkResponseSelectList} from "../../../common/swagger/customDecorator";
import {swagger} from "../../../../config/config";
import {AccountHistoryService} from "./accountHistory.service";
import {SelectAccountHistoryDto} from "./dto/select-accountHistory-dto";

@Controller('/account/:accountIdx(\\d+)/history')
@UseInterceptors(AccountInterceptor)
@UseGuards(AuthGuard)
@ApiTags('AccountHistory')
export class AccountHistoryController {
    constructor(
        private readonly accountService: AccountService,
        private readonly accountHistoryService: AccountHistoryService
    ) {}

    @Get('/')
    @ApiOperation({summary: '가계부 내역 조회'})
    @ApiOkResponseSelectList(AccountHistoryEntity, '가계부 내역 조회 성공')
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'accountIdx'})
    async selectAccountHistoryList(
        @Req() req: Request,
        @Query() query: SelectAccountHistoryDto
    ): Promise<CursorSelectListResponseType<AccountHistoryEntity>> {
        const {type, startCursor, count, accountHistoryCategoryIdx} = query;
        const accountInfo: AccountEntity = req.locals.accountInfo;

        return await this.accountHistoryService.selectList(accountInfo, type, startCursor, count, accountHistoryCategoryIdx);
    }

    @Post('/')
    @ApiOperation({summary: '가계부 내역 등록'})
    @ApiCreatedResponse({description: '가계부 내역 등록 성공', type: AccountHistoryEntity})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'accountIdx'})
    async createAccountHistory(
        @Req() req: Request,
        @Body() body: CreateAccountHistoryDto
    ): Promise<AccountHistoryEntity> {
        const account: AccountEntity = req.locals.accountInfo;

        return await this.accountHistoryService.create(account, body);
    }

    @Get('/:accountHistoryIdx(\\d+)')
    @UseInterceptors(AccountHistoryInterceptor)
    @ApiOperation({summary: '가계부 내역 상세 조회'})
    @ApiOkResponse({description: '가계부 내역 상세 조회 성공', type: AccountHistoryEntity})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'accountIdx'})
    @ApiParam({type: 'number', name: 'accountHistoryIdx'})
    async selectOneAccountHistory(
        @Req() req: Request
    ): Promise<AccountHistoryEntity> {
        const accountHistoryInfo: AccountHistoryEntity = req.locals.accountHistoryInfo;

        return accountHistoryInfo;
    }

    @Patch('/:accountHistoryIdx(\\d+)')
    @UseInterceptors(AccountHistoryInterceptor)
    @ApiOperation({summary: '가계부 내역 수정'})
    @ApiOkResponse({description: '가계부 내역 수정 성공', type: ResponseBooleanType})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'accountIdx'})
    @ApiParam({type: 'number', name: 'accountHistoryIdx'})
    async updateAccountHistory(
        @Req() req: Request,
        @Body() body: UpdateAccountHistoryDto
    ): Promise<ResponseBooleanType> {
        const accountHistoryInfo: AccountHistoryEntity = req.locals.accountHistoryInfo;

        await this.accountHistoryService.update(accountHistoryInfo, body);

        return {result: true};
    }

    @Delete('/:accountHistoryIdx(\\d+)')
    @UseInterceptors(AccountHistoryInterceptor)
    @ApiOperation({summary: '가계부 내역 삭제'})
    @ApiOkResponse({description: '가계부 내역 삭제 성공', type: ResponseBooleanType})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'accountIdx'})
    @ApiParam({type: 'number', name: 'accountHistoryIdx'})
    async deleteAccountHistory(
        @Req() req: Request
    ): Promise<ResponseBooleanType> {
        const accountHistoryInfo: AccountHistoryEntity = req.locals.accountHistoryInfo;

        await this.accountHistoryService.delete(accountHistoryInfo);

        return {result: true};
    }

}

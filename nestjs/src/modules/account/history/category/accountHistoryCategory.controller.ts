import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {Request} from "express";
import {ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "../../../../common/guard/auth.guard";
import {AccountHistoryCategoryService} from "./accountHistoryCategory.service";
import {MemberEntity} from "../../../member/entities/member.entity";
import {SelectAccountHistoryCategoryDto} from "./dto/select-accountHistoryCategory-dto";
import {AccountHistoryCategoryEntity} from "./entities/accountHistoryCategory.entity";
import {swagger} from "../../../../../config/config";
import {CreateAccountHistoryCategoryDto} from "./dto/create-accountHistoryCategory-dto";
import {AccountHistoryCategoryInterceptor} from "./accountHistoryCategory.interceptor";
import {ResponseBooleanType} from "../../../../common/type/type";
import {UpdateAccountHistoryCategoryDto} from "./dto/update-accountHistoryCategory-dto";

@Controller('/account/history/category')
@UseGuards(AuthGuard)
@ApiTags('AccountHistoryCategory')
export class AccountHistoryCategoryController {
    constructor(
        private readonly accountHistoryCategoryService: AccountHistoryCategoryService
    ) {}

    @Get('/')
    @ApiOperation({summary: '가계부 내역 카테고리 조회'})
    @ApiOkResponse({
        description: '가계부 내역 카테고리 등록 성공',
        type: [AccountHistoryCategoryEntity]
    })
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'accountIdx'})
    async selectAccountHistoryCategoryList(
        @Req() req: Request,
        @Query() query: SelectAccountHistoryCategoryDto
    ): Promise<AccountHistoryCategoryEntity[]> {
        const {type} = query;
        const memberInfo: MemberEntity = req.locals.memberInfo;

        return await this.accountHistoryCategoryService
            .selectList(memberInfo, type);
    }

    @Post('/')
    @ApiOperation({summary: '가계부 내역 카테고리 등록'})
    @ApiCreatedResponse({description: '가계부 내역 카테고리 등록 성공', type: AccountHistoryCategoryEntity})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'accountIdx'})
    async createAccountHistoryCategory(
        @Req() req: Request,
        @Body() body: CreateAccountHistoryCategoryDto
    ): Promise<AccountHistoryCategoryEntity> {
        const memberInfo: MemberEntity = req.locals.memberInfo;

        return await this.accountHistoryCategoryService.create(memberInfo, body);
    }

    @Patch('/:accountHistoryCategoryIdx(\\d+)')
    @UseInterceptors(AccountHistoryCategoryInterceptor)
    @ApiOperation({summary: '가계부 내역 카테고리 수정'})
    @ApiOkResponse({description: '가계부 내역 카테고리 수정 성공', type: ResponseBooleanType})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'accountHistoryCategoryIdx'})
    async updateAccountHistoryCategory(
        @Req() req: Request,
        @Body() body: UpdateAccountHistoryCategoryDto
    ): Promise<ResponseBooleanType> {
        const accountHistoryCategoryInfo: AccountHistoryCategoryEntity = req.locals.accountHistoryCategoryInfo;

        await this.accountHistoryCategoryService.update(accountHistoryCategoryInfo, body);

        return {result: true};
    }

    @Delete('/:accountHistoryCategoryIdx(\\d+)')
    @UseInterceptors(AccountHistoryCategoryInterceptor)
    @ApiOperation({summary: '가계부 내역 카테고리 삭제'})
    @ApiOkResponse({description: '가계부 내역 카테고리 삭제 성공', type: ResponseBooleanType})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'accountIdx'})
    @ApiParam({type: 'number', name: 'accountHistoryCategoryIdx'})
    async deleteAccountHistoryCategory(
        @Req() req: Request
    ): Promise<ResponseBooleanType> {
        const accountHistoryCategoryInfo: AccountHistoryCategoryEntity = req.locals.accountHistoryCategoryInfo;

        await this.accountHistoryCategoryService.delete(accountHistoryCategoryInfo);

        return {result: true};
    }

}

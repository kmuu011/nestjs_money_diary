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
import {TodoGroupService} from './todoGroup.service';
import {Request} from "express";
import {AuthGuard} from "../../common/guard/auth.guard";
import {Member} from "../member/entities/member.entity";
import {CreateTodoGroupDto} from "./dto/create-todoGroup-dto";
import {SelectQueryDto} from "../../common/dto/select-query-dto";
import {UpdateTodoGroupDto} from "./dto/update-todoGroup-dto";
import {TodoGroup} from "./entities/todoGroup.entity";
import {ResponseBooleanType, SelectListResponseType} from "../../common/type/type";
import {TodoGroupInterceptor} from "./todoGroup.interceptor";
import {ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {ApiOkResponseSelectList} from "../../common/swagger/customDecorator";
import {testTokenCode} from "../../../config/config";
import {todoGroupSelectResponse} from "./swagger/customResponse";

@Controller('/todoGroup')
@UseGuards(AuthGuard)
@ApiTags('TodoGroup')
export class TodoGroupController {
    constructor(private readonly todoGroupService: TodoGroupService) {}

    @Get()
    @ApiOperation({ summary: '할일 그룹 조회' })
    @ApiOkResponseSelectList(todoGroupSelectResponse, '할일 그룹 조회 성공')
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: testTokenCode}})
    async selectTodoGroupList(
        @Req() req: Request,
        @Query() query: SelectQueryDto
    ): Promise<SelectListResponseType<TodoGroup>> {
        const {page, count} = query;
        const member: Member = req.locals.memberInfo;

        return await this.todoGroupService.selectList(member, page, count);
    }

    @Post()
    @ApiOperation({ summary: '할일 그룹 등록' })
    @ApiCreatedResponse({
        description: '할일 그룹 등록 성공',
        type: TodoGroup
    })
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: testTokenCode}})
    async createTodoGroup(
        @Req() req: Request,
        @Body() body: CreateTodoGroupDto
    ): Promise<TodoGroup> {
        const member: Member = req.locals.memberInfo;

        const todoGroup: TodoGroup = await this.todoGroupService.create(member, body);

        delete todoGroup.member;

        return todoGroup;
    }

    @Get('/:todoGroupIdx(\\d+)')
    @UseInterceptors(TodoGroupInterceptor)
    @ApiOperation({ summary: '할일 그룹 단일 조회' })
    @ApiOkResponse({
        description: '할일 그룹 단일 조회',
        type: TodoGroup
    })
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: testTokenCode}})
    async selectOneTodoGroup(
        @Req() req: Request,
        @Param('todoGroupIdx') todoGroupIdx: number,
    ): Promise<TodoGroup> {
        return req.locals.todoGroupInfo;
    }

    @Patch('/:todoGroupIdx(\\d+)')
    @UseInterceptors(TodoGroupInterceptor)
    @ApiOperation({ summary: '할일 그룹 수정' })
    @ApiOkResponse({
        description: '할일 그룹 수정',
        type: ResponseBooleanType
    })
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: testTokenCode}})
    async updateTodoGroup(
        @Req() req: Request,
        @Body() body: UpdateTodoGroupDto,
        @Param('todoGroupIdx') todoGroupIdx: number,
    ): Promise<ResponseBooleanType> {
        const {memberInfo, todoGroupInfo} = req.locals;

        await this.todoGroupService.update(memberInfo, todoGroupInfo, body);

        return {result: true};
    }

    @Delete('/:todoGroupIdx(\\d+)')
    @UseInterceptors(TodoGroupInterceptor)
    @ApiOperation({ summary: '할일 그룹 삭제' })
    @ApiOkResponse({
        description: '할일 그룹 삭제',
        type: ResponseBooleanType
    })
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: testTokenCode}})
    async deleteTodoGroup(
        @Req() req: Request,
        @Param('todoGroupIdx') todoGroupIdx: number,
    ): Promise<ResponseBooleanType> {
        const {memberInfo, todoGroupInfo} = req.locals;

        await this.todoGroupService.delete(memberInfo, todoGroupInfo);

        return {result: true};
    }


}

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
import {TodoGroupService} from "../todoGroup.service";
import {TodoService} from "./todo.service";
import {SelectQueryDto} from "../../../common/dto/select-query-dto";
import {TodoGroupEntity} from "../entities/todoGroup.entity";
import {CreateTodoDto} from "./dto/create-todo-dto";
import {TodoEntity} from "./entities/todo.entity";
import {UpdateTodoDto} from "./dto/update-todo-dto";
import {ResponseBooleanType, SelectListResponseType} from "../../../common/type/type";

import {TodoInterceptor} from "./todo.interceptor";
import {TodoGroupInterceptor} from "../todoGroup.interceptor";
import {ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import {ApiOkResponseSelectList} from "../../../common/swagger/customDecorator";
import {swagger} from "../../../../config/config";

@Controller('/todoGroup/:todoGroupIdx(\\d+)/todo')
@UseInterceptors(TodoGroupInterceptor)
@UseGuards(AuthGuard)
@ApiTags('Todo')
export class TodoController {
    constructor(
        private readonly todoGroupService: TodoGroupService,
        private readonly todoService: TodoService
    ) {}

    @Get('/')
    @ApiOperation({summary: '할일 조회'})
    @ApiOkResponseSelectList(TodoEntity, '할일 조회 성공')
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'todoGroupIdx'})
    async selectTodoList(
        @Req() req: Request,
        @Query() query: SelectQueryDto
    ): Promise<SelectListResponseType<TodoEntity>> {
        const {page, count} = query;
        const todoGroupInfo: TodoGroupEntity = req.locals.todoGroupInfo;

        return await this.todoService.selectList(todoGroupInfo, page, count);
    }

    @Post('/')
    @ApiOperation({summary: '할일 등록'})
    @ApiCreatedResponse({description: '할일 등록 성공', type: TodoEntity})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'todoGroupIdx'})
    async createTodo(
        @Req() req: Request,
        @Body() body: CreateTodoDto
    ): Promise<TodoEntity> {
        const todoGroup: TodoGroupEntity = req.locals.todoGroupInfo;

        return await this.todoService.create(todoGroup, body);
    }

    @Patch('/:todoIdx(\\d+)')
    @UseInterceptors(TodoInterceptor)
    @ApiOperation({summary: '할일 수정'})
    @ApiOkResponse({description: '할일 수정 성공', type: ResponseBooleanType})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'todoGroupIdx'})
    @ApiParam({type: 'number', name: 'todoIdx'})
    async updateTodo(
        @Req() req: Request,
        @Body() body: UpdateTodoDto
    ): Promise<ResponseBooleanType> {
        const todoInfo: TodoEntity = req.locals.todoInfo;

        await this.todoService.update(todoInfo, body);

        return {result: true};
    }

    @Delete('/:todoIdx(\\d+)')
    @UseInterceptors(TodoInterceptor)
    @ApiOperation({summary: '할일 삭제'})
    @ApiOkResponse({description: '할일 삭제 성공', type: ResponseBooleanType})
    @ApiHeader({description: '토큰 코드', name: 'token-code', schema: {example: swagger.dummyUserInfo.tokenCode}})
    @ApiParam({type: 'number', name: 'todoGroupIdx'})
    @ApiParam({type: 'number', name: 'todoIdx'})
    async deleteTodo(
        @Req() req: Request
    ): Promise<ResponseBooleanType> {
        const todoInfo: TodoEntity = req.locals.todoInfo;

        await this.todoService.delete(todoInfo);

        return {result: true};
    }

}

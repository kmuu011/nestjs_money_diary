import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {createRequest, createResponse} from "node-mocks-http";
import {Request, Response} from "express";
import {CallHandler, ExecutionContext} from "@nestjs/common";
import {TodoController} from "../../../../src/modules/todoGroup/todo/todo.controller";
import {TodoService} from "../../../../src/modules/todoGroup/todo/todo.service";
import {TodoInterceptor} from "../../../../src/modules/todoGroup/todo/todo.interceptor";
import {getSavedMember} from "../../member/member";
import {MemberEntity} from "../../../../src/modules/member/entities/member.entity";
import {getSavedTodo} from "./todo";
import {TodoEntity} from "../../../../src/modules/todoGroup/todo/entities/todo.entity";
import {typeOrmOptions} from "../../../../config/config";
import {TodoGroupRepository} from "../../../../src/modules/todoGroup/todoGroup.repository";
import {TodoRepository} from "../../../../src/modules/todoGroup/todo/todo.repository";
import {getCallHandler, getExecutionContext} from "../../../common/const";
import {TokenRepository} from "../../../../src/modules/member/token/token.repository";
import {TodoGroupService} from "../../../../src/modules/todoGroup/todoGroup.service";
import {getSavedTodoGroup} from "../todoGroup";
import {TodoGroupEntity} from "../../../../src/modules/todoGroup/entities/todoGroup.entity";

describe('Todo Interceptor', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedTodoInfo: TodoEntity = getSavedTodo();
    const savedTodoGroupInfo: TodoGroupEntity = getSavedTodoGroup();

    let todoController: TodoController;
    let todoInterceptor: TodoInterceptor;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                    TodoGroupRepository,
                    TodoRepository
                ])
            ],
            controllers: [TodoController],
            providers: [
                TodoService,
                TodoGroupService,
                {
                    provide: TodoInterceptor,
                    useValue: TodoInterceptor
                }
            ]
        }).compile();

        todoController = module.get<TodoController>(TodoController);
        todoInterceptor = module.get<TodoInterceptor>(TodoInterceptor);
    });

    describe('intercept()', () => {
        it('할일 유효 검사 인터셉터', async () => {
            const req: Request = createRequest();
            const res: Response = createResponse();

            req.locals = {
                memberInfo: savedMemberInfo,
                todoGroupInfo: savedTodoGroupInfo
            };

            req.params = {
                todoIdx: savedTodoInfo.idx.toString()
            };

            const executionContext: ExecutionContext = getExecutionContext(req, res);
            const callHandler: CallHandler = getCallHandler();

            await todoInterceptor
                .intercept(executionContext, callHandler);

            expect(req.locals.todoInfo instanceof TodoEntity).toBeTruthy();
        });
    });
});
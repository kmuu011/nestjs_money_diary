import {TodoGroupController} from "../../../src/modules/todoGroup/todoGroup.controller";
import {TodoGroupService} from "../../../src/modules/todoGroup/todoGroup.service";
import {Member} from "../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../member/member";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../config/config";
import {TodoGroupRepository} from "../../../src/modules/todoGroup/todoGroup.repository";
import {createRequest, createResponse} from "node-mocks-http";
import {Request, Response} from "express";
import {getCallHandler, getExecutionContext} from "../../common/const";
import {TokenRepository} from "../../../src/modules/member/token/token.repository";
import {TodoGroup} from "../../../src/modules/todoGroup/entities/todoGroup.entity";
import {getSavedTodoGroup} from "./todoGroup";
import {TodoGroupInterceptor} from "../../../src/modules/todoGroup/todoGroup.interceptor";
import {CallHandler, ExecutionContext} from "@nestjs/common";

describe('TodoGroup Interceptor', () => {
    let todoGroupController: TodoGroupController;
    let todoGroupInterceptor: TodoGroupInterceptor;
    const savedMemberInfo: Member = getSavedMember();
    const savedTodoGroupInfo: TodoGroup = getSavedTodoGroup();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                    TodoGroupRepository
                ])
            ],
            controllers: [TodoGroupController],
            providers: [
                TodoGroupService,
                {
                    provide: TodoGroupInterceptor,
                    useValue: TodoGroupInterceptor
                }
            ]
        }).compile();

        todoGroupController = module.get<TodoGroupController>(TodoGroupController);
        todoGroupInterceptor = module.get<TodoGroupInterceptor>(TodoGroupInterceptor);
    });

    describe('intercept()', () => {
        it('할일 그룹 유효 검사 인터셉터', async () => {
            const req: Request = createRequest();
            const res: Response = createResponse();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            req.params = {
                todoGroupIdx: savedTodoGroupInfo.idx.toString()
            };

            const executionContext: ExecutionContext = getExecutionContext(req, res);
            const callHandler: CallHandler = getCallHandler();

            await todoGroupInterceptor
                .intercept(executionContext, callHandler);

            const response = await todoGroupController.selectOneTodoGroup(req, savedTodoGroupInfo.idx);

            expect(response instanceof TodoGroup).toBeTruthy();
        });
    });
});
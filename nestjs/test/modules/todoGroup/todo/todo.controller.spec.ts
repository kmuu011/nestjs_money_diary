import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {createRequest} from "node-mocks-http";
import {Request} from "express";
import {TodoGroup} from "../../../../src/modules/todoGroup/entities/todoGroup.entity";
import {getSavedTodoGroup} from "../todoGroup";
import {Todo} from "../../../../src/modules/todoGroup/todo/entities/todo.entity";
import {getCreateTodoData, getSavedTodo} from "./todo";
import {TodoController} from "../../../../src/modules/todoGroup/todo/todo.controller";
import {TodoService} from "../../../../src/modules/todoGroup/todo/todo.service";
import {typeOrmOptions} from "../../../../config/config";
import {TodoRepository} from "../../../../src/modules/todoGroup/todo/todo.repository";
import {ResponseBooleanType, SelectListResponseType} from "../../../../src/common/type/type";
import {getSelectQueryDto} from "../../../common/const";
import {CreateTodoDto} from "../../../../src/modules/todoGroup/todo/dto/create-todo-dto";
import {UpdateTodoDto} from "../../../../src/modules/todoGroup/todo/dto/update-todo-dto";
import {TokenRepository} from "../../../../src/modules/member/token/token.repository";
import {TodoGroupRepository} from "../../../../src/modules/todoGroup/todoGroup.repository";
import {TodoGroupService} from "../../../../src/modules/todoGroup/todoGroup.service";

describe('Todo Controller', () => {
    let todoController: TodoController;
    let todoService: TodoService;
    let createdTodoInfo: Todo;
    const savedTodoGroupInfo: TodoGroup = getSavedTodoGroup();

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
                TodoGroupService,
                TodoService,
            ]
        }).compile();

        todoController = module.get<TodoController>(TodoController);
        todoService = module.get<TodoService>(TodoService);
    });

    describe('selectList()', () => {
        it('할일 리스트 조회', async () => {
            const req: Request = createRequest();

            req.locals = {
                todoGroupInfo: savedTodoGroupInfo
            };

            const response: SelectListResponseType<Todo>
                = await todoController.selectTodolist(req, getSelectQueryDto());

            expect(response.items.every(v => v instanceof Todo)).toBeTruthy();
        });
    });

    describe('createTodo()', () => {
        it('할일 등록', async () => {
            const req: Request = createRequest();

            req.locals = {
                todoGroupInfo: savedTodoGroupInfo
            };

            const createTodoDto: CreateTodoDto = getCreateTodoData();

            const response: Todo = await todoController.createTodo(req, createTodoDto);

            expect(response instanceof Todo).toBeTruthy();

            createdTodoInfo = response;
        });
    });

    describe('updateTodo()', () => {
        it('할일 수정', async () => {
            const updateTodoDto: UpdateTodoDto = {
                content: "수정된 할일 내용",
                complete: false
            };
            const req: Request = createRequest();

            req.locals = {
                todoInfo: createdTodoInfo
            };

            const response: ResponseBooleanType
                = await todoController.updateTodo(req, updateTodoDto);

            expect(response.result).toBeTruthy();
        });
    });

    describe('deleteTodo()', () => {
        it('할일 삭제', async () => {
            const req: Request = createRequest();

            req.locals = {
                todoInfo: createdTodoInfo
            };

            const response: ResponseBooleanType
                = await todoController.deleteTodo(req);

            expect(response.result).toBeTruthy();
        });
    });


});
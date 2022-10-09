import {TodoGroupController} from "../../../src/modules/todoGroup/todoGroup.controller";
import {TodoGroupService} from "../../../src/modules/todoGroup/todoGroup.service";
import {MemberEntity} from "../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../member/member";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../config/config";
import {TodoGroupRepository} from "../../../src/modules/todoGroup/todoGroup.repository";
import {createRequest} from "node-mocks-http";
import {Request} from "express";
import {TokenRepository} from "../../../src/modules/member/token/token.repository";
import {ResponseBooleanType, SelectListResponseType} from "../../../src/common/type/type";
import {TodoGroupEntity} from "../../../src/modules/todoGroup/entities/todoGroup.entity";
import {CreateTodoGroupDto} from "../../../src/modules/todoGroup/dto/create-todoGroup-dto";
import {getCreateTodoGroupData, getSavedTodoGroup} from "./todoGroup";
import {UpdateTodoGroupDto} from "../../../src/modules/todoGroup/dto/update-todoGroup-dto";
import {getSelectQueryDto} from "../../common/const";
import {TodoRepository} from "../../../src/modules/todoGroup/todo/todo.repository";

describe('TodoGroup Controller', () => {
    let todoGroupController: TodoGroupController;
    let todoGroupService: TodoGroupService;
    let createdTodoGroup: TodoGroupEntity;
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedTodoGroupInfo: TodoGroupEntity = getSavedTodoGroup();

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
            controllers: [TodoGroupController],
            providers: [
                TodoGroupService,
            ]
        }).compile();

        todoGroupController = module.get<TodoGroupController>(TodoGroupController);
        todoGroupService = module.get<TodoGroupService>(TodoGroupService);
    });

    describe('selectList()', () => {
        it('할일 그룹 리스트 조회', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const response: SelectListResponseType<TodoGroupEntity>
                = await todoGroupController.selectTodoGroupList(req, getSelectQueryDto());

            expect(response.items.every(v => v instanceof TodoGroupEntity)).toBeTruthy();
        });
    });

    describe('createTodoGroup()', () => {
        it('할일 그룹 등록', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const createTodoGroupDto: CreateTodoGroupDto = getCreateTodoGroupData();

            const response: TodoGroupEntity = await todoGroupController.createTodoGroup(req, createTodoGroupDto);

            expect(response instanceof TodoGroupEntity).toBeTruthy();

            createdTodoGroup = response;
        });
    });

    describe('selectOneTodoGroup()', () => {
        it('할일 그룹 상세 조회', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo,
                todoGroupInfo: savedTodoGroupInfo
            };

            const response = await todoGroupController.selectOneTodoGroup(req, savedTodoGroupInfo.idx);

            expect(response instanceof TodoGroupEntity).toBeTruthy();
        });
    });

    describe('updateTodoGroup()', () => {
        it('할일 그룹 수정', async () => {
            const updateTodoGroupDto: UpdateTodoGroupDto = getCreateTodoGroupData();
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo,
                todoGroupInfo: createdTodoGroup
            };

            const response: ResponseBooleanType
                = await todoGroupController.updateTodoGroup(req, updateTodoGroupDto, createdTodoGroup.idx);

            expect(response.result).toBeTruthy();
        });
    });

    describe('deleteTodoGroup()', () => {
        it('할일 그룹 삭제', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo,
                todoGroupInfo: createdTodoGroup
            };

            const response: ResponseBooleanType
                = await todoGroupController.deleteTodoGroup(req, createdTodoGroup.idx);

            expect(response.result).toBeTruthy();
        });
    });


});
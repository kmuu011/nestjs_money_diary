import {Test, TestingModule} from "@nestjs/testing";
import {TodoGroupRepository} from "../../../src/modules/todoGroup/todoGroup.repository";
import {MemberEntity} from "../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../member/member";
import {TodoGroupEntity} from "../../../src/modules/todoGroup/entities/todoGroup.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../config/config";
import {getCreateTodoGroupData, getSavedTodoGroup} from "./todoGroup";
import {DeleteResult, UpdateResult} from "typeorm";

describe('TodoGroup Repository', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedTodoGroupInfo: TodoGroupEntity = getSavedTodoGroup();

    let todoGroupRepository: TodoGroupRepository;
    let createdTodoGroupInfo: TodoGroupEntity;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TodoGroupRepository
                ])
            ],
        }).compile()

        todoGroupRepository = module.get<TodoGroupRepository>(TodoGroupRepository);

        for(let i=0 ; i<4 ; i++){
            savedTodoGroupInfo.idx = i+1;
            const todoGroup: TodoGroupEntity = await todoGroupRepository.selectOne(savedMemberInfo, savedTodoGroupInfo.idx);

            if (todoGroup) continue;

            await todoGroupRepository.createTodoGroup(undefined, savedTodoGroupInfo);
        }

        savedTodoGroupInfo.idx = (getSavedTodoGroup()).idx;
    });

    describe('selectOne()', () => {
        it('할일 그룹 상세 조회', async () => {
            const result: TodoGroupEntity = await todoGroupRepository.selectOne(savedMemberInfo, savedTodoGroupInfo.idx);

            expect(result instanceof TodoGroupEntity).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('할일 그룹 목록 조회', async () => {
            const result: [TodoGroupEntity[], number] = await todoGroupRepository.selectList(savedMemberInfo, 1, 10);

            expect(result[0].every(v => v instanceof TodoGroupEntity)).toBeTruthy();
            expect(typeof result[1] === "number").toBeTruthy();
        });
    });

    describe('create()', () => {
        it('할일 그룹 등록', async () => {
            const createTodoGroupData: TodoGroupEntity = getCreateTodoGroupData();

            const insertResult: TodoGroupEntity = await todoGroupRepository.createTodoGroup(undefined,createTodoGroupData);

            expect(insertResult instanceof TodoGroupEntity).toBeTruthy();

            createdTodoGroupInfo = await todoGroupRepository.selectOne(insertResult.member, insertResult.idx);
            createdTodoGroupInfo.member = insertResult.member;
        });
    });

    describe('update()', () => {
        it('할일 그룹 수정', async () => {
            createdTodoGroupInfo.order++;

            const updateResult: UpdateResult = await todoGroupRepository.updateTodoGroup(createdTodoGroupInfo);

            expect(updateResult.affected === 1).toBeTruthy();
        });
    });

    describe('delete()', () => {
        it('할일 그룹 삭제', async () => {
            const deleteResult: DeleteResult = await todoGroupRepository.deleteTodoGroup(createdTodoGroupInfo);

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });

});
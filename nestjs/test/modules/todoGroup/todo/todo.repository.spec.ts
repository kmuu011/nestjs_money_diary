import {Test, TestingModule} from "@nestjs/testing";
import {getSavedTodoGroup} from "../todoGroup";
import {DeleteResult, UpdateResult} from "typeorm";
import {TodoRepository} from "../../../../src/modules/todoGroup/todo/todo.repository";
import {TodoGroup} from "../../../../src/modules/todoGroup/entities/todoGroup.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../../config/config";
import {TodoGroupRepository} from "../../../../src/modules/todoGroup/todoGroup.repository";
import {Todo} from "../../../../src/modules/todoGroup/todo/entities/todo.entity";
import {getCreateTodoData, getSavedTodo} from "./todo";
import {UpdateTodoDto} from "../../../../src/modules/todoGroup/todo/dto/update-todo-dto";

describe('Todo Repository', () => {
    const savedTodoGroupInfo: TodoGroup = getSavedTodoGroup();
    const savedTodoInfo: Todo = getSavedTodo();

    let todoGroupRepository: TodoGroupRepository;
    let todoRepository: TodoRepository;
    let createdTodoInfo: Todo;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TodoGroupRepository,
                    TodoRepository
                ])
            ],
        }).compile()

        todoGroupRepository = module.get<TodoGroupRepository>(TodoGroupRepository);
        todoRepository = module.get<TodoRepository>(TodoRepository);

        for(let i=0 ; i<4 ; i++){
            savedTodoInfo.idx = i+1;
            const todo: Todo = await todoRepository.selectOne(savedTodoGroupInfo, savedTodoInfo.idx);

            if (todo) continue;

            await todoRepository.createTodo(savedTodoInfo);
        }

        savedTodoInfo.idx = (getSavedTodo()).idx;
    });

    describe('selectOne()', () => {
        it('할일 상세 조회', async () => {
            const result: Todo = await todoRepository.selectOne(savedTodoGroupInfo, savedTodoInfo.idx);

            expect(result instanceof Todo).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('할일 목록 조회', async () => {
            const result: [Todo[], number] = await todoRepository.selectList(savedTodoGroupInfo, 1, 10);

            expect(result[0].every(v => v instanceof Todo)).toBeTruthy();
            expect(typeof result[1] === "number").toBeTruthy();
        });
    });

    describe('createTodo()', () => {
        it('할일 등록', async () => {
            const result: Todo = await todoRepository.createTodo(getCreateTodoData());

            expect(result instanceof Todo).toBeTruthy();

            createdTodoInfo = result;
        });
    });

    describe('updateTodo()', () => {
        it('할일 수정', async () => {
            let updateTodoDto: UpdateTodoDto = {
                content: '수정된 할일 내용',
                complete: false
            };

            let updateResult: UpdateResult
                = await todoRepository.updateTodo(createdTodoInfo, updateTodoDto);
            expect(updateResult.affected === 1).toBeTruthy();

            const notCompletedOne: Todo
                = await todoRepository.selectOne(savedTodoGroupInfo, createdTodoInfo.idx);
            expect(notCompletedOne.completedAt === null).toBeTruthy();

            updateTodoDto = {
                content: '완료된 할일',
                complete: true
            };

            updateResult
                = await todoRepository.updateTodo(createdTodoInfo, updateTodoDto);
            expect(updateResult.affected === 1).toBeTruthy();

            const completedOne: Todo
                = await todoRepository.selectOne(savedTodoGroupInfo, createdTodoInfo.idx);
            expect(completedOne.completedAt !== null).toBeTruthy();
        });
    });

    describe('deleteTodo()', () => {
        it('할일 삭제', async () => {
            const deleteResult: DeleteResult
                = await todoRepository.deleteTodo(createdTodoInfo);

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });

});
import {Injectable} from '@nestjs/common';
import {SelectListResponseType} from "../../../common/type/type";
import {TodoRepository} from "./todo.repository";
import {TodoEntity} from "./entities/todo.entity";
import {TodoGroupEntity} from "../entities/todoGroup.entity";
import {CreateTodoDto} from "./dto/create-todo-dto";
import {UpdateTodoDto} from "./dto/update-todo-dto";
import {DeleteResult, UpdateResult} from "typeorm";
import {Message} from "../../../../libs/message";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoRepository) private readonly todoRepository: TodoRepository
    ) {}

    async selectOne(todoGroup: TodoGroupEntity, todoIdx: number): Promise<TodoEntity> {
        return await this.todoRepository.selectOne(todoGroup, todoIdx);
    }

    async selectList(todoGroup: TodoGroupEntity, page: number, count: number): Promise<SelectListResponseType<TodoEntity>> {
        const result = await this.todoRepository.selectList(todoGroup, page, count);

        return {
            items: result[0],
            page,
            count,
            totalCount: result[1],
            last: Math.ceil(result[1] / count) || 1
        };
    }

    async create(todoGroup: TodoGroupEntity, createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo: TodoEntity = new TodoEntity();

        todo.dataMigration(createTodoDto);
        todo.todoGroup = todoGroup;

        return this.todoRepository.createTodo(todo)
    }

    async update(todo: TodoEntity, updateTodoDto: UpdateTodoDto): Promise<UpdateResult> {
        todo.dataMigration(updateTodoDto);

        const updateResult: UpdateResult = await this.todoRepository.updateTodo(todo, updateTodoDto);

        if (updateResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        return updateResult;
    }

    async delete(todo: TodoEntity): Promise<DeleteResult> {
        const deleteResult: DeleteResult = await this.todoRepository.deleteTodo(todo);

        if (deleteResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        return deleteResult;
    }

}

import {Injectable} from '@nestjs/common';
import {SelectListResponseType} from "../../../common/type/type";
import {TodoRepository} from "./todo.repository";
import {Todo} from "./entities/todo.entity";
import {TodoGroup} from "../entities/todoGroup.entity";
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

    async selectOne(todoGroup: TodoGroup, todoIdx: number): Promise<Todo> {
        return await this.todoRepository.selectOne(todoGroup, todoIdx);
    }

    async selectList(todoGroup: TodoGroup, page: number, count: number): Promise<SelectListResponseType<Todo>> {
        const result = await this.todoRepository.selectList(todoGroup, page, count);

        return {
            items: result[0],
            page,
            count,
            totalCount: result[1],
            last: Math.ceil(result[1] / count) || 1
        };
    }

    async create(todoGroup: TodoGroup, createTodoDto: CreateTodoDto): Promise<Todo> {
        const todo: Todo = new Todo();

        todo.dataMigration(createTodoDto);
        todo.todoGroup = todoGroup;

        return this.todoRepository.createTodo(todo)
    }

    async update(todo: Todo, updateTodoDto: UpdateTodoDto): Promise<UpdateResult> {
        todo.dataMigration(updateTodoDto);

        const updateResult: UpdateResult = await this.todoRepository.updateTodo(todo, updateTodoDto);

        if (updateResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        return updateResult;
    }

    async delete(todo: Todo): Promise<DeleteResult> {
        const deleteResult: DeleteResult = await this.todoRepository.deleteTodo(todo);

        if (deleteResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        return deleteResult;
    }

}

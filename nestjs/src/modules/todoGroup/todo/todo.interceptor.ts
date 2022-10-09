import {Injectable, ExecutionContext, NestInterceptor, CallHandler} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Request} from "express";
import {TodoRepository} from "./todo.repository";
import {TodoEntity} from "./entities/todo.entity";
import {TodoGroupEntity} from "../entities/todoGroup.entity";
import {Message} from "../../../../libs/message";

@Injectable()
export class TodoInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(TodoRepository) private todoRepository: TodoRepository,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const req: Request = context.switchToHttp().getRequest();
        const todoGroupInfo: TodoGroupEntity = req.locals.todoGroupInfo;
        const todoIdx: number = Number(req.params.todoIdx);

        const todoInfo: TodoEntity = await this.todoRepository.selectOne(todoGroupInfo, todoIdx);

        if (!todoInfo) {
            throw Message.NOT_EXIST('todo');
        }

        req.locals.todoInfo = todoInfo;

        return next.handle();
    }
}

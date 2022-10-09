import {Injectable, ExecutionContext, NestInterceptor, CallHandler} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Message} from "../../../libs/message";
import {Request,} from "express";
import {TodoGroupRepository} from "./todoGroup.repository";
import {MemberEntity} from "../member/entities/member.entity";
import {TodoGroupEntity} from "./entities/todoGroup.entity";

@Injectable()
export class TodoGroupInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(TodoGroupRepository) private todoGroupRepository: TodoGroupRepository,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const req: Request = context.switchToHttp().getRequest();
        const memberInfo: MemberEntity = req.locals.memberInfo;
        const todoGroupIdx: number = Number(req.params.todoGroupIdx);

        const todoGroupInfo: TodoGroupEntity = await this.todoGroupRepository.selectOne(memberInfo, todoGroupIdx);

        if (!todoGroupInfo) {
            throw Message.NOT_EXIST('todoGroup');
        }

        req.locals.todoGroupInfo = todoGroupInfo;

        return next.handle();
    }
}

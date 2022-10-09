import {Injectable} from '@nestjs/common';
import {TodoGroupRepository} from "./todoGroup.repository";
import {TodoGroupEntity} from "./entities/todoGroup.entity";
import {MemberEntity} from "../member/entities/member.entity";
import {CreateTodoGroupDto} from "./dto/create-todoGroup-dto";
import {DeleteResult, UpdateResult} from "typeorm";
import {Message} from "../../../libs/message";
import {UpdateTodoGroupDto} from "./dto/update-todoGroup-dto";
import {SelectListResponseType} from "../../common/type/type";
import {InjectRepository} from "@nestjs/typeorm";
import {TodoRepository} from "./todo/todo.repository";

@Injectable()
export class TodoGroupService {
    constructor(
        @InjectRepository(TodoGroupRepository) private readonly todoGroupRepository: TodoGroupRepository,
        @InjectRepository(TodoRepository) private readonly todoRepository: TodoRepository
    ) {}

    async arrangeOrder(member: MemberEntity, todoGroup?: TodoGroupEntity, order?: number): Promise<void> {
        const todoGroupList = (await this.todoGroupRepository.selectList(member))[0];
        let splicedTodoGroupList = [...todoGroupList];

        if (todoGroup) {
            splicedTodoGroupList.splice(todoGroupList.findIndex(v => v.idx === todoGroup.idx), 1);

            if (order === 1) {
                splicedTodoGroupList.push(todoGroup);
            } else if (order === todoGroupList.length) {
                splicedTodoGroupList.unshift(todoGroup);
            } else {
                const targetIdx = todoGroupList.findIndex(v => v.order === order);

                splicedTodoGroupList = [...splicedTodoGroupList.slice(0, targetIdx), todoGroup, ...splicedTodoGroupList.slice(targetIdx, splicedTodoGroupList.length)];
            }
        }

        for (let i = 0; i < splicedTodoGroupList.length; i++) {
            splicedTodoGroupList[i].order = splicedTodoGroupList.length - i;

            const updateResult: UpdateResult = await this.todoGroupRepository.updateTodoGroup(splicedTodoGroupList[i]);

            if (updateResult.affected !== 1) {
                throw Message.SERVER_ERROR;
            }
        }
    }

    async selectOne(member: MemberEntity, todoGroupIdx: number): Promise<TodoGroupEntity> {
        return await this.todoGroupRepository.selectOne(member, todoGroupIdx);
    }

    async selectList(member: MemberEntity, page: number, count: number): Promise<SelectListResponseType<TodoGroupEntity>> {
        const result = await this.todoGroupRepository.selectList(member, page, count);

        for (const r of result[0]) {
            r.todoList = (await this.todoRepository.selectList(r, 1, 5))[0];
        }

        return {
            items: result[0],
            page,
            count,
            totalCount: result[1],
            last: Math.ceil(result[1] / count) || 1
        };
    }

    async create(member: MemberEntity, body: CreateTodoGroupDto): Promise<TodoGroupEntity> {
        const todoGroup: TodoGroupEntity = new TodoGroupEntity();
        todoGroup.dataMigration({
            ...body,
            ...{member}
        });

        todoGroup.order = (await this.todoGroupRepository.selectList(member))[1] + 1;

        await this.arrangeOrder(member);

        return await this.todoGroupRepository.createTodoGroup(undefined, todoGroup);
    }

    async update(member: MemberEntity, todoGroup: TodoGroupEntity, body: UpdateTodoGroupDto): Promise<UpdateResult> {
        todoGroup.title = body.title;

        const updateResult: UpdateResult = await this.todoGroupRepository.updateTodoGroup(todoGroup);

        if (updateResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        if (todoGroup.order !== body.order && body.order !== undefined) {
            await this.arrangeOrder(member, todoGroup, body.order);
        }

        return updateResult;
    }

    async delete(member: MemberEntity, todoGroup: TodoGroupEntity): Promise<DeleteResult> {
        const deleteResult: DeleteResult = await this.todoGroupRepository.deleteTodoGroup(todoGroup);

        if (deleteResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        await this.arrangeOrder(member);

        return deleteResult
    }

}

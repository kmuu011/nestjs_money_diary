import {DeleteResult, EntityRepository, QueryRunner, Repository, UpdateResult} from "typeorm";
import {TodoGroupEntity} from "./entities/todoGroup.entity";
import {MemberEntity} from "../member/entities/member.entity";
import {getUpdateObject} from "../../../libs/utils";

@EntityRepository(TodoGroupEntity)
export class TodoGroupRepository extends Repository<TodoGroupEntity> {

    async selectOne(member: MemberEntity, todoGroupIdx: number): Promise<TodoGroupEntity> {
        return await this.findOne({
            where: {member, idx: todoGroupIdx}
        });
    }

    async selectList(member: MemberEntity, page?: number, count?: number): Promise<[TodoGroupEntity[], number]> {
        let query = this.createQueryBuilder('tg');

        if(page && count){
            query = query
                .skip((page-1)*count)
                .take(count);
        }

        return await query
            .where({member})
            .orderBy('`order`', "DESC")
            .getManyAndCount();
    }

    async createTodoGroup(queryRunner: QueryRunner, todoGroup: TodoGroupEntity): Promise<TodoGroupEntity> {
        if(queryRunner){
            return await queryRunner.manager.save(todoGroup);
        }else {
            return await this.save(todoGroup);
        }
    }

    async updateTodoGroup(todoGroup: TodoGroupEntity): Promise<UpdateResult> {
        const obj = getUpdateObject(["title", "order"], todoGroup, true);

        return await this.update(todoGroup.idx, obj);
    }

    async deleteTodoGroup(todoGroup: TodoGroupEntity): Promise<DeleteResult> {
        return await this.delete(todoGroup.idx);
    }

}
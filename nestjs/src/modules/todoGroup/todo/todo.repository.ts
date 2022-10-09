import {DeleteResult, EntityRepository, Repository, UpdateResult} from "typeorm";
import {TodoEntity} from "./entities/todo.entity";
import {TodoGroupEntity} from "../entities/todoGroup.entity";
import {getUpdateObject} from "../../../../libs/utils";
import {UpdateTodoDto} from "./dto/update-todo-dto";

@EntityRepository(TodoEntity)
export class TodoRepository extends Repository<TodoEntity> {

    async selectOne(todoGroup: TodoGroupEntity, todoIdx: number): Promise<TodoEntity> {
        return await this.findOne({
            where: {todoGroup, idx: todoIdx}
        });
    }
    async selectList(todoGroup: TodoGroupEntity, page?: number, count?: number): Promise<[TodoEntity[], number]> {
        let query = this.createQueryBuilder('t');

        if (page && count) {
            query = query
                .skip((page - 1)*count)
                .take(count);
        }

        return await query
            .where({todoGroup})
            .orderBy('createdAt', 'DESC')
            .getManyAndCount();
    }

    async createTodo(todo: TodoEntity): Promise<TodoEntity> {
        return await this.save(todo)
    }

    async updateTodo(todo: TodoEntity, updateTodoDto: UpdateTodoDto): Promise<UpdateResult> {
        const obj = getUpdateObject(["content"], todo, true);

        if (updateTodoDto.complete !== undefined) {
            if (updateTodoDto.complete === true && !todo.completedAt) {
                obj.completedAt = () => "now()";
            } else if(updateTodoDto.complete === false && todo.completedAt){
                obj.completedAt = undefined;
            }
        }

        return await this.update(todo.idx, obj);
    }

    async deleteTodo(todo: TodoEntity): Promise<DeleteResult> {
        return await this.delete(todo.idx);
    }

}
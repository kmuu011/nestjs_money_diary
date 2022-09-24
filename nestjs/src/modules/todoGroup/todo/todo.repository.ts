import {DeleteResult, EntityRepository, Repository, UpdateResult} from "typeorm";
import {Todo} from "./entities/todo.entity";
import {TodoGroup} from "../entities/todoGroup.entity";
import {getUpdateObject} from "../../../../libs/utils";
import {UpdateTodoDto} from "./dto/update-todo-dto";

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {

    async selectOne(todoGroup: TodoGroup, todoIdx: number): Promise<Todo> {
        return await this.findOne({
            where: {todoGroup, idx: todoIdx}
        });
    }
    async selectList(todoGroup: TodoGroup, page?: number, count?: number): Promise<[Todo[], number]> {
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

    async createTodo(todo: Todo): Promise<Todo> {
        return await this.save(todo)
    }

    async updateTodo(todo: Todo, updateTodoDto: UpdateTodoDto): Promise<UpdateResult> {
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

    async deleteTodo(todo: Todo): Promise<DeleteResult> {
        return await this.delete(todo.idx);
    }

}
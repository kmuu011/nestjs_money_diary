import {TodoEntity} from "../entities/todo.entity";
import {PickType} from "@nestjs/swagger";

export class CreateTodoDto extends PickType(
    TodoEntity,
    ['content'] as const
) {}
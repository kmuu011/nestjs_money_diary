import {Todo} from "../entities/todo.entity";
import {PickType} from "@nestjs/swagger";

export class CreateTodoDto extends PickType(
    Todo,
    ['content'] as const
) {}
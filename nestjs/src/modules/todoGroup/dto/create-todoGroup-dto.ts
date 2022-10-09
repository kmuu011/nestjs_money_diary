import {TodoGroupEntity} from "../entities/todoGroup.entity";
import {PickType} from "@nestjs/swagger";

export class CreateTodoGroupDto extends PickType(
    TodoGroupEntity,
    ['title'] as const
) {}
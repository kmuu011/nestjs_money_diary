import {TodoGroup} from "../entities/todoGroup.entity";
import {PickType} from "@nestjs/swagger";

export class CreateTodoGroupDto extends PickType(
    TodoGroup,
    ['title'] as const
) {}
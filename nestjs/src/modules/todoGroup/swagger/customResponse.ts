import {ApiProperty, getSchemaPath, PickType} from "@nestjs/swagger";
import {TodoGroup} from "../entities/todoGroup.entity";
import {Todo} from "../todo/entities/todo.entity";

export class todoGroupSelectResponse extends PickType(
    TodoGroup,
    [
        'idx', 'title', "order", "createdAt", "updatedAt"
    ] as const
) {
    @ApiProperty({
        type: "array",
        items: { $ref: getSchemaPath(Todo) },
    })
    todoList: Todo
}

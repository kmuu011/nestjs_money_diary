import {ApiProperty, getSchemaPath, PickType} from "@nestjs/swagger";
import {TodoGroupEntity} from "../entities/todoGroup.entity";
import {TodoEntity} from "../todo/entities/todo.entity";

export class TodoGroupSelectResponse extends PickType(
    TodoGroupEntity,
    [
        'idx', 'title', "order", "createdAt", "updatedAt"
    ] as const
) {
    @ApiProperty({
        type: "array",
        items: { $ref: getSchemaPath(TodoEntity) },
    })
    todoList: TodoEntity
}

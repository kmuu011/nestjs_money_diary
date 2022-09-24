import {Todo} from "../entities/todo.entity";
import {IsBoolean, IsOptional} from "class-validator";
import {ApiPropertyOptional, PickType} from "@nestjs/swagger";

export class UpdateTodoDto extends PickType(
    Todo,
    ['content'] as const
) {
    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional()
    readonly complete: boolean;
}
import {TodoGroupEntity} from "../entities/todoGroup.entity";
import {IsNumber, IsOptional} from "class-validator";
import {ApiPropertyOptional, PickType} from "@nestjs/swagger";

export class UpdateTodoGroupDto extends PickType(
    TodoGroupEntity,
    ['title'] as const
) {

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        example: 1
    })
    readonly order: number;
}
import {IsNumber, IsOptional} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";

export class CursorSelectQueryDto {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        example: 12
    })
    cursor: number = 0;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        example: 10
    })
    count: number = 10;
}
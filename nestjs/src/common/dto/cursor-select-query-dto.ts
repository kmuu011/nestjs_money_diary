import {IsNumber, IsOptional} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";

export class CursorSelectQueryDto {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        example: 12
    })
    startCursor: number = 0;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        example: 2
    })
    endCursor?: number = 0;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        example: 10
    })
    count: number = 10;
}
import {IsNumber, IsOptional} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";

export class SelectQueryDto {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        example: 1
    })
    page: number = 1;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        example: 10
    })
    count: number = 10;
}
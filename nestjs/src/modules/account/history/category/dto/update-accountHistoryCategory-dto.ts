import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateAccountHistoryCategoryDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: '교통비'
    })
    name?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: 'f1f1f1'
    })
    color?: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        example: 1
    })
    order?: number;
}
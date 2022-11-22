import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsOptional, IsString, Length} from "class-validator";

export class UpdateAccountHistoryCategoryDto {
    @IsString()
    @Length(1, 10)
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
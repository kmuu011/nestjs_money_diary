import {IsNumber, IsOptional, IsString} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";

export class UpdateAccountDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: '제 91 가계부'
    })
    accountName: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        example: 1
    })
    order: number;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        example: 1
    })
    invisibleAmount: number;
}
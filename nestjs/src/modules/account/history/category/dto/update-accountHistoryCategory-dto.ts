import {ApiPropertyOptional, PickType} from "@nestjs/swagger";
import {AccountHistoryCategoryEntity} from "../entities/accountHistoryCategory.entity";
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateAccountHistoryCategoryDto extends PickType(
    AccountHistoryCategoryEntity,
    ['name', 'type'] as const
) {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: 'f1f1f1'
    })
    color: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        example: 1
    })
    order: number;
}
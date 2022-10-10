import {IsNumber, IsOptional} from "class-validator";
import {ApiPropertyOptional, PickType} from "@nestjs/swagger";
import {AccountEntity} from "../entities/account.entity";

export class UpdateAccountDto extends PickType(
    AccountEntity,
    ['accountName'] as const
) {
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
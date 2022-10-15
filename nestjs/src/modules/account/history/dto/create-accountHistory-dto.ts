import {ApiProperty, PickType} from "@nestjs/swagger";
import {AccountHistoryEntity} from "../entities/accountHistory.entity";
import {IsNotEmpty, IsNumber} from "class-validator";

export class CreateAccountHistoryDto extends PickType(
    AccountHistoryEntity,
    ['content', 'amount', 'type'] as const
) {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: 3
    })
    accountHistoryCategoryIdx: number;
}
import {ApiProperty, PickType} from "@nestjs/swagger";
import {AccountHistoryEntity} from "../entities/accountHistory.entity";
import {IsNumber} from "class-validator";

export class UpdateAccountHistoryDto extends PickType(
    AccountHistoryEntity,
    ['content', 'amount', 'type'] as const
) {
    @IsNumber()
    @ApiProperty({
        example: 3
    })
    accountHistoryCategoryIdx: number;
}
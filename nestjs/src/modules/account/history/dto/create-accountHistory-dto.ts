import {ApiProperty, ApiPropertyOptional, PickType} from "@nestjs/swagger";
import {AccountHistoryEntity} from "../entities/accountHistory.entity";
import {IsDateString, IsNumber} from "class-validator";

export class CreateAccountHistoryDto extends PickType(
    AccountHistoryEntity,
    ['content', 'amount', 'type'] as const
) {
    @IsNumber()
    @ApiProperty({
        example: 3
    })
    accountHistoryCategoryIdx: number;

    @IsDateString()
    @ApiPropertyOptional({
        example: '2011-12-31T15:00:00.000Z'
    })
    createdAt: string;
}
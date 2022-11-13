import {ApiProperty, ApiPropertyOptional, PickType} from "@nestjs/swagger";
import {AccountHistoryEntity} from "../entities/accountHistory.entity";
import {IsDateString, IsNumber, IsString} from "class-validator";

export class UpdateAccountHistoryDto extends PickType(
    AccountHistoryEntity,
    ['amount', 'type'] as const
) {
    @IsString()
    @ApiPropertyOptional({
        example: '식비'
    })
    content: string;

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
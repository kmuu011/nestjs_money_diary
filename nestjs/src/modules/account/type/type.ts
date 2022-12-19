import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional} from "class-validator";

export class AccountCursorSelectListResponseType<T> {
    items: T[];

    @ApiProperty({
        example: 12
    })
    startCursor: number;

    @ApiPropertyOptional({
        example: 10
    })
    @IsOptional()
    count?: number;

    @ApiProperty({
        example: 32
    })
    totalCount: number;

    @ApiProperty({
        example: 4
    })
    last: number;

    @ApiProperty({
        example: 120000
    })
    totalAmount: number;
}

export class AccountDailyCostSummaryType {
    @ApiProperty({
        example: '20221207'
    })
    date: string

    @ApiProperty({
        example: 10000
    })
    outcome: number

    @ApiProperty({
        example: 10000
    })
    income: number
}

export class AccountMonthCostSummaryType {
    @ApiProperty({
        example: 10000
    })
    outcome: number

    @ApiProperty({
        example: 10000
    })
    income: number
}

export class AccountMonthSummaryResponseType {
    @ApiProperty({
        example: [{date: "221207", outcome: 1000, income: 1000}]
    })
    accountHistoryDailyCostSummary: AccountDailyCostSummaryType[]

    @ApiProperty({
        example: {outcome: 10000, income: 10000}
    })
    accountHistoryMonthCostSummary: AccountMonthCostSummaryType
}

export class AccountCostSummaryByCategoryType {
    @ApiProperty({
        example: '#f1f1f1'
    })
    color: string

    @ApiProperty({
        example: '식비'
    })
    categoryName: string

    @ApiProperty({
        example: '1'
    })
    accountHistoryCategoryIdx: number

    @ApiProperty({
        example: 34000
    })
    amount: number
}

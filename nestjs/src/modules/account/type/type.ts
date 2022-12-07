import {ApiProperty} from "@nestjs/swagger";

export class AccountCursorSelectListResponseType<T> {
    items: T[];

    @ApiProperty({
        example: 12
    })
    startCursor: number;

    @ApiProperty({
        example: 10
    })
    count: number;

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

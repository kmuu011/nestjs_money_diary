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
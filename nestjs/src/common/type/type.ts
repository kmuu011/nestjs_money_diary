import Buffer from "buffer";
import {MemberEntity} from "../../modules/member/entities/member.entity";
import {ApiProperty} from "@nestjs/swagger";
import {AccountEntity} from "../../modules/account/entities/account.entity";
import {AccountHistoryEntity} from "../../modules/account/history/entities/accountHistory.entity";
import {
    AccountHistoryCategoryEntity
} from "../../modules/account/history/category/entities/accountHistoryCategory.entity";

export interface FileType {
    fileType: string;
    fileName: string;
    fileBuffer: Buffer;
    fileSize: number;
}

export interface ValidatorType {
    reg: RegExp;
    msg: string;
}

export interface ValidatorTypeObj {
    [key: string]: ValidatorType;
}

export class SelectListResponseType<T> {
    items: T[];

    @ApiProperty({
        example: 1
    })
    page: number;

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
}

export class CursorSelectListResponseType<T> {
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
}

export interface LocalsType {
    memberInfo?: MemberEntity;
    accountInfo?: AccountEntity;
    accountHistoryInfo?: AccountHistoryEntity;
    accountHistoryCategoryInfo?: AccountHistoryCategoryEntity;
}

export class LoginResponseType {
    @ApiProperty({
        example: 'j8quvthu89vnrodf3t9ug1wj5vf0e9z6fnmmlukc'
    })
    tokenCode: string;
}

export class ResponseBooleanType {
    @ApiProperty({
        example: true
    })
    result: boolean;
}

export interface AccountIncomeOutcomeType {
    outcome: number;
    income: number;
}

export interface DateObjectType {
    year: string;
    month: string;
    date: string;
    day: number;
    dayStr: string;
    hour: string;
    minute: string;
    second: string;
}


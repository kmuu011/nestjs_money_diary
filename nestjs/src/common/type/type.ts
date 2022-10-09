import Buffer from "buffer";
import {MemberEntity} from "../../modules/member/entities/member.entity";
import {TodoGroupEntity} from "../../modules/todoGroup/entities/todoGroup.entity";
import {TodoEntity} from "../../modules/todoGroup/todo/entities/todo.entity";
import {ApiProperty} from "@nestjs/swagger";
import {AccountEntity} from "../../modules/account/entities/account.entity";

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

export interface LocalsType {
    memberInfo?: MemberEntity;
    todoGroupInfo?: TodoGroupEntity;
    todoInfo?: TodoEntity;
    accountInfo?: AccountEntity;
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


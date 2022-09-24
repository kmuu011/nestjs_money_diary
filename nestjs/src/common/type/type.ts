import Buffer from "buffer";
import {Member} from "../../modules/member/entities/member.entity";
import {TodoGroup} from "../../modules/todoGroup/entities/todoGroup.entity";
import {Todo} from "../../modules/todoGroup/todo/entities/todo.entity";
import {ApiProperty} from "@nestjs/swagger";

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
    memberInfo?: Member;
    todoGroupInfo?: TodoGroup;
    todoInfo?: Todo;
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


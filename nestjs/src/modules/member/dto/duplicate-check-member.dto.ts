import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class DuplicateCheckMemberDto {
    @IsNumber()
    @ApiProperty({
        example: 0,
        description: '0: id, 1: nickname, 2: email'
    })
    readonly type: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: 'tts'
    })
    readonly value: string;
}
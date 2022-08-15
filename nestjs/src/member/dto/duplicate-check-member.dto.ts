import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class DuplicateCheckMemberDto {
    @IsNumber()
    readonly type: number;

    @IsNotEmpty()
    @IsString()
    readonly value: string;
}
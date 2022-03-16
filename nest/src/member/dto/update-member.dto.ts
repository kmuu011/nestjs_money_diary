import {IsEmail, IsNumber, IsString} from "class-validator";
import {Member} from "../model/member.model";

export class UpdateMemberDto extends Member {
    @IsNumber()
    readonly idx: number;

    @IsString()
    readonly id: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly nickname: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly ip: string;

    @IsString()
    readonly user_agent: string;
}


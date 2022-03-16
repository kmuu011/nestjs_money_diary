import {IsNumber, IsString} from "class-validator";
import {Member} from "../model/member.model";

export class LoginMemberDto extends Member {
    @IsString()
    readonly id:string;

    @IsString()
    readonly password:string;

    @IsNumber()
    readonly keep_check: boolean
}
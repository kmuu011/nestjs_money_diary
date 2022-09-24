import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Member} from "../entities/member.entity";
import {ApiPropertyOptional, PickType} from "@nestjs/swagger";

export class UpdateMemberDto extends PickType(
    Member,
    ['nickname', 'email'] as const
){
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: 'tts0000'
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiPropertyOptional({
        example: 'tts0000'
    })
    originalPassword: string;
}
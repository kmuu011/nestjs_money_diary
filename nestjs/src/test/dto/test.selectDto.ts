import {IsOptional, IsString} from "class-validator";

export class TestSelectDto {
    @IsOptional()
    @IsString()
    readonly name: string;
}
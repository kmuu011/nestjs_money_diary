import {IsString} from "class-validator";

export class TestDto {
    @IsString()
    readonly name: string;

}
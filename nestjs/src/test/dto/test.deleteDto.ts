import {IsNumber, IsOptional} from "class-validator";

export class TestDeleteDto {
    @IsOptional()
    readonly idx: number
}
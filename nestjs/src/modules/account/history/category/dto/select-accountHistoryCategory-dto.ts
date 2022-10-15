import {IsNumber} from "class-validator";
import {ApiPropertyOptional} from "@nestjs/swagger";

export class SelectAccountHistoryCategoryDto {

    @IsNumber()
    @ApiPropertyOptional({
        example: 1
    })
    type: number = 1;
}
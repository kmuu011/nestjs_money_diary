import {IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class SelectAccountHistoryCostSummaryByCategoryDto{
    @IsNumber()
    @ApiProperty({
        example: 0
    })
    type: number;

    @IsString()
    @ApiProperty({
        example: '2022'
    })
    year: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: '12'
    })
    month?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: "1,2,3,4"
    })
    multipleAccountIdx?: string;
}
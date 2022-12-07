import {IsOptional, IsString} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class SelectAccountMonthCostSummaryDto{
    @IsString()
    @ApiProperty({
        example: '2022'
    })
    year: string;

    @IsString()
    @ApiProperty({
        example: '12'
    })
    month: string;

    @IsString()
    @ApiProperty({
        example: '20221127'
    })
    startDate: string;

    @IsString()
    @ApiProperty({
        example: '20221231'
    })
    endDate: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: "1,2,3,4"
    })
    multipleAccountIdx?: string;
}
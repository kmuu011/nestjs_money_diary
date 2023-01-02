import {IsNumber, IsOptional, IsString} from "class-validator";
import {ApiPropertyOptional, PickType} from "@nestjs/swagger";
import {CursorSelectQueryDto} from "../../../../common/dto/cursor-select-query-dto";

export class SelectAccountHistoryDto extends PickType(
    CursorSelectQueryDto,
    ['startCursor', 'count'] as const
) {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: "1,2,3,4"
    })
    multipleAccountIdx?: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        example: 0
    })
    type?: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: "1,2,3,4"
    })
    multipleAccountHistoryCategoryIdx?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: "2022"
    })
    year?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: "12"
    })
    month?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: "08"
    })
    date?: string;
}
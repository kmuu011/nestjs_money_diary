import {IsNumber, IsOptional} from "class-validator";
import {ApiPropertyOptional, PickType} from "@nestjs/swagger";
import {CursorSelectQueryDto} from "../../../../common/dto/cursor-select-query-dto";

export class SelectAccountHistoryDto extends PickType(
    CursorSelectQueryDto,
    ['cursor', 'count'] as const
) {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        example: 0
    })
    type: number;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        example: 3
    })
    accountHistoryCategoryIdx: number;
}
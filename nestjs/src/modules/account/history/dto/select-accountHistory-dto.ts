import {IsNumber} from "class-validator";
import {ApiPropertyOptional, PickType} from "@nestjs/swagger";
import {SelectQueryDto} from "../../../../common/dto/select-query-dto";

export class SelectAccountHistoryDto extends PickType(
    SelectQueryDto,
    ['page', 'count'] as const
) {
    @IsNumber()
    @ApiPropertyOptional({
        example: 0
    })
    type: number = 1;
}
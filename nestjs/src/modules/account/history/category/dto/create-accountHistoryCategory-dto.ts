import {PickType} from "@nestjs/swagger";
import {AccountHistoryCategoryEntity} from "../entities/accountHistoryCategory.entity";

export class CreateAccountHistoryCategoryDto extends PickType(
    AccountHistoryCategoryEntity,
    ['name', 'type'] as const
) {}
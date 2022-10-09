import {PickType} from "@nestjs/swagger";
import {AccountHistoryEntity} from "../entities/accountHistory.entity";

export class UpdateAccountHistoryDto extends PickType(
    AccountHistoryEntity,
    ['content', 'amount', 'type'] as const
) {}
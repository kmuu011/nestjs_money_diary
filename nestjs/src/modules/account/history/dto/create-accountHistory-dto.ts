import {PickType} from "@nestjs/swagger";
import {AccountHistoryEntity} from "../entities/accountHistory.entity";

export class CreateAccountHistoryDto extends PickType(
    AccountHistoryEntity,
    ['content', 'amount', 'type'] as const
) {}
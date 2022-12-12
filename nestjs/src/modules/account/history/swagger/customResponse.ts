import {ApiProperty, PickType} from "@nestjs/swagger";
import {AccountHistoryEntity} from "../entities/accountHistory.entity";
import {AccountEntity} from "../../entities/account.entity";

export class AccountHistorySelectResponse extends PickType(
    AccountHistoryEntity,
    [
        'idx', 'accountHistoryCategory', 'amount',
        'content', 'type', 'createdAt', 'updatedAt'
    ] as const
) {

    @ApiProperty({
        example: {
            idx: 1,
            accountName: "제 1 가계부"
        }
    })
    account: AccountEntity;
}

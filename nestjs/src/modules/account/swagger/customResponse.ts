import {ApiProperty, getSchemaPath, PickType} from "@nestjs/swagger";
import {AccountEntity} from "../entities/account.entity";
import {AccountHistoryEntity} from "../history/entities/accountHistory.entity";

export class AccountSelectResponse extends PickType(
    AccountEntity,
    [
        'idx', 'title', "order", "createdAt", "updatedAt"
    ] as const
) {
    @ApiProperty({
        type: "array",
        items: { $ref: getSchemaPath(AccountHistoryEntity) },
    })
    accountHistoryList: AccountHistoryEntity
}

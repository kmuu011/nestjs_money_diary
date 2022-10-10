import {PickType} from "@nestjs/swagger";
import {AccountEntity} from "../entities/account.entity";

export class AccountSelectResponse extends PickType(
    AccountEntity,
    [
        'idx', 'accountName', 'order',
        'invisibleAmount','totalAmount',
        'createdAt', 'updatedAt'
    ] as const
) {}

import {PickType} from "@nestjs/swagger";
import {AccountEntity} from "../entities/account.entity";

export class CreateAccountDto extends PickType(
    AccountEntity,
    ['title'] as const
) {}
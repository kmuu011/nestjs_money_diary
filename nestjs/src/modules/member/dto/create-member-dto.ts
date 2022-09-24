import {Member} from "../entities/member.entity";
import {PickType} from "@nestjs/swagger";

export class CreateMemberDto extends PickType(
    Member,
    ['id', 'nickname', 'email', 'password'] as const
) {}
import {Member} from "../entities/member.entity";
import {PickType} from "@nestjs/swagger";

export class LoginMemberDto extends PickType(
    Member,
    ['id', 'password', 'keepCheck'] as const
) {}
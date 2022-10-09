import {MemberEntity} from "../entities/member.entity";
import {PickType} from "@nestjs/swagger";

export class LoginMemberDto extends PickType(
    MemberEntity,
    ['id', 'password', 'keepCheck'] as const
) {}
import {MemberEntity} from "../entities/member.entity";
import {PickType} from "@nestjs/swagger";

export class CreateMemberDto extends PickType(
    MemberEntity,
    ['id', 'nickname', 'email', 'password'] as const
) {}
import {Member} from "../model/member.model";
import {PickType} from "@nestjs/mapped-types";

export class CreateMemberDto extends PickType(
    Member,
    ['id', 'nickname', 'email', 'password'] as const
) {}
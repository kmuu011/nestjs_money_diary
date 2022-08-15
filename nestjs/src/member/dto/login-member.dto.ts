import {Member} from "../model/member.model";
import {PickType} from "@nestjs/mapped-types";

export class LoginMemberDto extends PickType(
    Member,
    ['id', 'password', 'keep_check'] as const
) {}
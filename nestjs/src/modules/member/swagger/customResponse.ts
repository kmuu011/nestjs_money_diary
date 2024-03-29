import {PickType} from "@nestjs/swagger";
import {MemberEntity} from "../entities/member.entity";

export class MemberAuthResponse extends PickType(
    MemberEntity,
    [
        'idx', 'id', 'nickname', 'email',
        'profileImgKey', 'createdAt',
        'authType', 'ip', 'userAgent',
        'tokenInfo'
    ] as const
) {}
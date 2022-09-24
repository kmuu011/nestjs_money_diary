import {PickType} from "@nestjs/swagger";
import {Member} from "../entities/member.entity";

export class memberAuthResponse extends PickType(
    Member,
    [
        'idx', 'id', 'nickname', 'email',
        'profileImgKey', 'createdAt',
        'authType', 'ip', 'userAgent',
        'tokenInfo'
    ] as const
) {}
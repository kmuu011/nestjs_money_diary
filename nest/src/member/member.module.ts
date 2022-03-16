import {Module} from '@nestjs/common';
import {MemberController} from './member.controller';
import {MemberService} from "./member.service";
import {MemberDao} from "./member.dao";
import {Member} from "./model/member.model";

@Module({
    imports: [],
    controllers: [MemberController],
    providers: [MemberService, MemberDao, Member],
})

export class MemberModule {}

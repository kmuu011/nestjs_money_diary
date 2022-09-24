import {Module} from '@nestjs/common';
import {MemberController} from './member.controller';
import {MemberService} from "./member.service";

@Module({
    imports: [],
    controllers: [MemberController],
    providers: [MemberService],
})

export class MemberModule {
}

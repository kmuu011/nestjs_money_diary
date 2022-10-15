import {Module} from '@nestjs/common';
import {MemberController} from './member.controller';
import {MemberService} from "./member.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountHistoryCategoryRepository} from "../account/history/category/accountHistoryCategory.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountHistoryCategoryRepository,
        ]),
    ],
    controllers: [MemberController],
    providers: [MemberService],
})

export class MemberModule {
}

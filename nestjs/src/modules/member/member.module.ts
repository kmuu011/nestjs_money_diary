import {Module} from '@nestjs/common';
import {MemberController} from './member.controller';
import {MemberService} from "./member.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountHistoryCategoryRepository} from "../account/history/category/accountHistoryCategory.repository";
import {AccountHistoryRepository} from "../account/history/accountHistory.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountHistoryCategoryRepository,
            AccountHistoryRepository
        ]),
    ],
    controllers: [MemberController],
    providers: [MemberService],
})

export class MemberModule {
}

import {Module} from '@nestjs/common';
import {AccountHistoryController} from "./accountHistory.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountHistoryService} from "./accountHistory.service";
import {AccountHistoryRepository} from "./accountHistory.repository";
import {AccountHistoryCategoryModule} from "./category/accountHistoryCategory.module";
import {AccountHistoryCategoryRepository} from "./category/accountHistoryCategory.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountHistoryRepository,
            AccountHistoryCategoryRepository
        ]),
        AccountHistoryCategoryModule
    ],
    controllers: [AccountHistoryController],
    providers: [
        AccountHistoryService,
    ],
})

export class AccountHistoryModule {}

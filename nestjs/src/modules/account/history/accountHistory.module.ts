import {Module} from '@nestjs/common';
import {AccountHistoryController} from "./accountHistory.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountHistoryService} from "./accountHistory.service";
import {AccountHistoryRepository} from "./accountHistory.repository";
import {AccountHistoryCategoryModule} from "./category/accountHistoryCategory.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountHistoryRepository,
        ]),
        AccountHistoryCategoryModule
    ],
    controllers: [AccountHistoryController],
    providers: [
        AccountHistoryService,
    ],
})

export class AccountHistoryModule {}

import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountHistoryCategoryRepository} from "./accountHistoryCategory.repository";
import {AccountHistoryCategoryController} from "./accountHistoryCategory.controller";
import {AccountHistoryCategoryService} from "./accountHistoryCategory.service";
import {AccountHistoryRepository} from "../accountHistory.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountHistoryCategoryRepository,
            AccountHistoryRepository
        ]),
    ],
    controllers: [AccountHistoryCategoryController],
    providers: [
        AccountHistoryCategoryService,
    ],
})

export class AccountHistoryCategoryModule {}

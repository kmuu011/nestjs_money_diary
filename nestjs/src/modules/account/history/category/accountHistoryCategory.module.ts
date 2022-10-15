import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountHistoryCategoryRepository} from "./accountHistoryCategory.repository";
import {AccountHistoryCategoryController} from "./accountHistoryCategory.controller";
import {AccountHistoryCategoryService} from "./accountHistoryCategory.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountHistoryCategoryRepository,
        ]),
    ],
    controllers: [AccountHistoryCategoryController],
    providers: [
        AccountHistoryCategoryService,
    ],
})

export class AccountHistoryCategoryModule {}

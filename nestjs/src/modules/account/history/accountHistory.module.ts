import {Module} from '@nestjs/common';
import {AccountHistoryController} from "./accountHistory.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountHistoryService} from "./accountHistory.service";
import {AccountHistoryRepository} from "./accountHistory.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountHistoryRepository,
        ]),
    ],
    controllers: [AccountHistoryController],
    providers: [
        AccountHistoryService,
    ],
})

export class AccountHistoryModule {}

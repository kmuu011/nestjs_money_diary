import {Global, Module} from '@nestjs/common';
import {AccountController} from './account.controller';
import {AccountService} from './account.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountRepository} from "./account.repository";
import {AccountHistoryModule} from "./history/accountHistory.module";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountRepository,
        ]),
        AccountHistoryModule
    ],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [
        TypeOrmModule.forFeature([
            AccountRepository,
        ]),
        AccountService,
    ]
})

export class AccountModule {}

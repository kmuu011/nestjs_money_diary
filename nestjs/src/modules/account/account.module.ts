import {Global, Module} from '@nestjs/common';
import {AccountController} from './account.controller';
import {AccountService} from './account.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountRepository} from "./account.repository";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountRepository,
        ]),
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

import {Injectable, ExecutionContext, NestInterceptor, CallHandler} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Request} from "express";
import {AccountHistoryRepository} from "./accountHistory.repository";
import {AccountHistoryEntity} from "./entities/accountHistory.entity";
import {Message} from "../../../../libs/message";
import {AccountEntity} from "../entities/account.entity";

@Injectable()
export class AccountHistoryInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(AccountHistoryRepository) private accountHistoryRepository: AccountHistoryRepository,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const req: Request = context.switchToHttp().getRequest();
        const account: AccountEntity = req.locals.accountInfo;
        const accountHistoryIdx: number = Number(req.params.accountHistoryIdx);

        const accountHistoryInfo: AccountHistoryEntity = await this.accountHistoryRepository.selectOne(account, accountHistoryIdx);

        if (!accountHistoryInfo) {
            throw Message.NOT_EXIST('accountHistory');
        }

        accountHistoryInfo.account = account;

        req.locals.accountHistoryInfo = accountHistoryInfo;

        return next.handle();
    }
}

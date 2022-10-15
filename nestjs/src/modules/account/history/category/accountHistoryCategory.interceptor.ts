import {Injectable, ExecutionContext, NestInterceptor, CallHandler} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Request} from "express";
import {AccountHistoryCategoryRepository} from "./accountHistoryCategory.repository";
import {MemberEntity} from "../../../member/entities/member.entity";
import {Message} from "../../../../../libs/message";
import {AccountHistoryCategoryEntity} from "./entities/accountHistoryCategory.entity";

@Injectable()
export class AccountHistoryCategoryInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(AccountHistoryCategoryRepository) private accountHistoryRepository: AccountHistoryCategoryRepository,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const req: Request = context.switchToHttp().getRequest();
        const memberInfo: MemberEntity = req.locals.memberInfo;
        const accountHistoryCategoryIdx: number = Number(req.params.accountHistoryCategoryIdx);

        const accountHistoryCategoryInfo: AccountHistoryCategoryEntity =
            await this.accountHistoryRepository.selectOne(memberInfo, accountHistoryCategoryIdx);

        if (!accountHistoryCategoryInfo) {
            throw Message.NOT_EXIST('category');
        }

        accountHistoryCategoryInfo.member = memberInfo;

        req.locals.accountHistoryCategoryInfo = accountHistoryCategoryInfo;

        return next.handle();
    }
}

import {Injectable, ExecutionContext, NestInterceptor, CallHandler} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Message} from "../../../libs/message";
import {Request,} from "express";
import {MemberEntity} from "../member/entities/member.entity";
import {AccountRepository} from "./account.repository";
import {AccountEntity} from "./entities/account.entity";

@Injectable()
export class AccountInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(AccountRepository) private accountRepository: AccountRepository,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const req: Request = context.switchToHttp().getRequest();
        const memberInfo: MemberEntity = req.locals.memberInfo;
        const accountIdx: number = Number(req.params.accountIdx);

        const accountInfo: AccountEntity = await this.accountRepository.selectOne(memberInfo, accountIdx);

        if (!accountInfo) {
            throw Message.NOT_EXIST('account');
        }

        accountInfo.member = memberInfo;

        req.locals.accountInfo = accountInfo;

        return next.handle();
    }
}

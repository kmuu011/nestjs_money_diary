import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {createRequest, createResponse} from "node-mocks-http";
import {Request, Response} from "express";
import {CallHandler, ExecutionContext} from "@nestjs/common";
import {getSavedMember} from "../../member/member";
import {MemberEntity} from "../../../../src/modules/member/entities/member.entity";
import {getSavedAccountHistory} from "./accountHistory";
import {typeOrmOptions} from "../../../../config/config";
import {getCallHandler, getExecutionContext} from "../../../common/const";
import {TokenRepository} from "../../../../src/modules/member/token/token.repository";
import {AccountHistoryEntity} from "../../../../src/modules/account/history/entities/accountHistory.entity";
import {getSavedAccount} from "../account";
import {AccountEntity} from "../../../../src/modules/account/entities/account.entity";
import {AccountHistoryController} from "../../../../src/modules/account/history/accountHistory.controller";
import {AccountHistoryInterceptor} from "../../../../src/modules/account/history/accountHistory.interceptor";
import {AccountRepository} from "../../../../src/modules/account/account.repository";
import {AccountHistoryRepository} from "../../../../src/modules/account/history/accountHistory.repository";
import {AccountHistoryService} from "../../../../src/modules/account/history/accountHistory.service";
import {AccountService} from "../../../../src/modules/account/account.service";
import {
    AccountHistoryCategoryRepository
} from "../../../../src/modules/account/history/category/accountHistoryCategory.repository";

describe('AccountHistory Interceptor', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedAccountHistoryInfo: AccountHistoryEntity = getSavedAccountHistory();
    const savedAccountInfo: AccountEntity = getSavedAccount();

    let accountHistoryController: AccountHistoryController;
    let accountHistoryInterceptor: AccountHistoryInterceptor;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                    AccountRepository,
                    AccountHistoryRepository,
                    AccountHistoryCategoryRepository
                ])
            ],
            controllers: [AccountHistoryController],
            providers: [
                AccountHistoryService,
                AccountService,
                {
                    provide: AccountHistoryInterceptor,
                    useValue: AccountHistoryInterceptor
                }
            ]
        }).compile();

        accountHistoryController = module.get<AccountHistoryController>(AccountHistoryController);
        accountHistoryInterceptor = module.get<AccountHistoryInterceptor>(AccountHistoryInterceptor);
    });

    describe('intercept()', () => {
        it('가계부 내역 유효 검사 인터셉터', async () => {
            const req: Request = createRequest();
            const res: Response = createResponse();

            req.locals = {
                memberInfo: savedMemberInfo,
                accountInfo: savedAccountInfo
            };

            req.params = {
                accountHistoryIdx: savedAccountHistoryInfo.idx.toString()
            };

            const executionContext: ExecutionContext = getExecutionContext(req, res);
            const callHandler: CallHandler = getCallHandler();

            await accountHistoryInterceptor
                .intercept(executionContext, callHandler);

            expect(req.locals.accountHistoryInfo instanceof AccountHistoryEntity).toBeTruthy();
        });
    });
});
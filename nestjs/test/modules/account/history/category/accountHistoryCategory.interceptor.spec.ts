import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {createRequest, createResponse} from "node-mocks-http";
import {Request, Response} from "express";
import {CallHandler, ExecutionContext} from "@nestjs/common";
import {MemberEntity} from "../../../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../../../member/member";
import {
    AccountHistoryCategoryEntity
} from "../../../../../src/modules/account/history/category/entities/accountHistoryCategory.entity";
import {getSavedAccountHistoryCategory} from "./accountHistoryCategory";
import {
    AccountHistoryCategoryController
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.controller";
import {
    AccountHistoryCategoryInterceptor
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.interceptor";
import {typeOrmOptions} from "../../../../../config/config";
import {
    AccountHistoryCategoryRepository
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.repository";
import {
    AccountHistoryCategoryService
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.service";
import {getCallHandler, getExecutionContext} from "../../../../common/const";
import {TokenRepository} from "../../../../../src/modules/member/token/token.repository";

describe('AccountHistoryCategory Interceptor', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedAccountHistoryCategoryInfo: AccountHistoryCategoryEntity = getSavedAccountHistoryCategory();

    let accountHistoryCategoryController: AccountHistoryCategoryController;
    let accountHistoryCategoryInterceptor: AccountHistoryCategoryInterceptor;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                    AccountHistoryCategoryRepository
                ])
            ],
            controllers: [AccountHistoryCategoryController],
            providers: [
                AccountHistoryCategoryService,
                {
                    provide: AccountHistoryCategoryInterceptor,
                    useValue: AccountHistoryCategoryInterceptor
                }
            ]
        }).compile();

        accountHistoryCategoryController = module.get<AccountHistoryCategoryController>(AccountHistoryCategoryController);
        accountHistoryCategoryInterceptor = module.get<AccountHistoryCategoryInterceptor>(AccountHistoryCategoryInterceptor);
    });

    describe('intercept()', () => {
        it('가계부 내역 카테고리 유효 검사 인터셉터', async () => {
            const req: Request = createRequest();
            const res: Response = createResponse();

            req.locals = {
                memberInfo: savedMemberInfo,
            };

            req.params = {
                accountHistoryCategoryIdx: savedAccountHistoryCategoryInfo.idx.toString()
            };

            const executionContext: ExecutionContext = getExecutionContext(req, res);
            const callHandler: CallHandler = getCallHandler();

            await accountHistoryCategoryInterceptor
                .intercept(executionContext, callHandler);

            expect(req.locals.accountHistoryCategoryInfo instanceof AccountHistoryCategoryEntity).toBeTruthy();
        });
    });
});
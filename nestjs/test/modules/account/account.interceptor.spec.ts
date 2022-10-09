import {AccountController} from "../../../src/modules/account/account.controller";
import {AccountService} from "../../../src/modules/account/account.service";
import {MemberEntity} from "../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../member/member";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../config/config";
import {AccountRepository} from "../../../src/modules/account/account.repository";
import {createRequest, createResponse} from "node-mocks-http";
import {Request, Response} from "express";
import {getCallHandler, getExecutionContext} from "../../common/const";
import {TokenRepository} from "../../../src/modules/member/token/token.repository";
import {AccountEntity} from "../../../src/modules/account/entities/account.entity";
import {getSavedAccount} from "./account";
import {AccountInterceptor} from "../../../src/modules/account/account.interceptor";
import {CallHandler, ExecutionContext} from "@nestjs/common";

describe('Account Interceptor', () => {
    let accountController: AccountController;
    let accountInterceptor: AccountInterceptor;
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedAccountInfo: AccountEntity = getSavedAccount();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                    AccountRepository
                ])
            ],
            controllers: [AccountController],
            providers: [
                AccountService,
                {
                    provide: AccountInterceptor,
                    useValue: AccountInterceptor
                }
            ]
        }).compile();

        accountController = module.get<AccountController>(AccountController);
        accountInterceptor = module.get<AccountInterceptor>(AccountInterceptor);
    });

    describe('intercept()', () => {
        it('가계부 유효 검사 인터셉터', async () => {
            const req: Request = createRequest();
            const res: Response = createResponse();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            req.params = {
                accountIdx: savedAccountInfo.idx.toString()
            };

            const executionContext: ExecutionContext = getExecutionContext(req, res);
            const callHandler: CallHandler = getCallHandler();

            await accountInterceptor
                .intercept(executionContext, callHandler);

            const response = await accountController.selectOneAccount(req, savedAccountInfo.idx);

            expect(response instanceof AccountEntity).toBeTruthy();
        });
    });
});
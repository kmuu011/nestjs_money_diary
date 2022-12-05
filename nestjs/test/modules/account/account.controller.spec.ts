import {AccountController} from "../../../src/modules/account/account.controller";
import {AccountService} from "../../../src/modules/account/account.service";
import {MemberEntity} from "../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../member/member";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../config/config";
import {AccountRepository} from "../../../src/modules/account/account.repository";
import {createRequest} from "node-mocks-http";
import {Request} from "express";
import {TokenRepository} from "../../../src/modules/member/token/token.repository";
import {CursorSelectListResponseType, ResponseBooleanType} from "../../../src/common/type/type";
import {AccountEntity} from "../../../src/modules/account/entities/account.entity";
import {CreateAccountDto} from "../../../src/modules/account/dto/create-account-dto";
import {
    accountMonthSummaryDto,
    getCreateAccountData,
    getSavedAccount,
    monthDailySummaryDataKeyList,
    monthSummaryDataKeyList
} from "./account";
import {UpdateAccountDto} from "../../../src/modules/account/dto/update-account-dto";
import {getCursorSelectQueryDto} from "../../common/const";
import {createRandomString} from "../../../libs/utils";
import {dataExpect} from "../../../libs/test";
import {SelectAccountMonthSummaryDto} from "../../../src/modules/account/dto/select-accountHistoryMonthSummary-dto";

describe('Account Controller', () => {
    let accountController: AccountController;
    let accountService: AccountService;
    let createdAccount: AccountEntity;
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedAccountInfo: AccountEntity = getSavedAccount();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                    AccountRepository,
                ])
            ],
            controllers: [AccountController],
            providers: [
                AccountService,
            ]
        }).compile();

        accountController = module.get<AccountController>(AccountController);
        accountService = module.get<AccountService>(AccountService);
    });


    describe('selectMonthSummary()', () => {
        it('가계부 월별 요약 조회', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const accountMonthSummary = await accountController.selectAccountMonthSummary(req,
                accountMonthSummaryDto
            );

            dataExpect(monthDailySummaryDataKeyList, accountMonthSummary.accountHistoryMonthDailySummary);
            dataExpect(monthSummaryDataKeyList, [accountMonthSummary.accountHistoryMonthSummary]);
        });
    });

    describe('selectList()', () => {
        it('가계부 리스트 조회', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const response: CursorSelectListResponseType<AccountEntity> =
                await accountController.selectAccountList(req, getCursorSelectQueryDto());

            const endCursor: number = response.items[1].order;

            const responseWithEndCursor: CursorSelectListResponseType<AccountEntity> =
                await accountController.selectAccountList(req, {
                    ...getCursorSelectQueryDto(),
                    endCursor
                });

            expect(response.items.every(v => v instanceof AccountEntity)).toBeTruthy();
            expect(responseWithEndCursor.items.length === 2).toBeTruthy();
        });
    });

    describe('createAccount()', () => {
        it('가계부 등록', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const createAccountDto: CreateAccountDto = getCreateAccountData();

            const response: AccountEntity = await accountController.createAccount(req, createAccountDto);

            expect(response instanceof AccountEntity).toBeTruthy();

            createdAccount = response;
        });
    });

    describe('selectOneAccount()', () => {
        it('가계부 상세 조회', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo,
                accountInfo: savedAccountInfo
            };

            const response = await accountController.selectOneAccount(req, savedAccountInfo.idx);

            expect(response instanceof AccountEntity).toBeTruthy();
        });
    });

    describe('updateAccount()', () => {
        it('가계부 수정', async () => {
            const updateAccountDto: UpdateAccountDto = getCreateAccountData();

            const newAccountName: string = `수정된 가계부 ${createRandomString(6)}`;
            const newInvisibleAmount: number = 1;
            updateAccountDto.accountName = newAccountName;
            updateAccountDto.invisibleAmount = newInvisibleAmount;

            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo,
                accountInfo: createdAccount
            };

            const response: ResponseBooleanType
                = await accountController.updateAccount(req, updateAccountDto, createdAccount.idx);

            const updatedAccount: AccountEntity = await accountService.selectOne(savedMemberInfo, createdAccount.idx);

            expect(response.result).toBeTruthy();
            expect(updatedAccount.accountName === newAccountName).toBeTruthy();
            expect(updatedAccount.invisibleAmount === newInvisibleAmount).toBeTruthy();
        });
    });

    describe('deleteAccount()', () => {
        it('가계부 삭제', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo,
                accountInfo: createdAccount
            };

            const response: ResponseBooleanType
                = await accountController.deleteAccount(req, createdAccount.idx);

            expect(response.result).toBeTruthy();
        });
    });

});
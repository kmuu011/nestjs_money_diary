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
import {ResponseBooleanType, SelectListResponseType} from "../../../src/common/type/type";
import {AccountEntity} from "../../../src/modules/account/entities/account.entity";
import {CreateAccountDto} from "../../../src/modules/account/dto/create-account-dto";
import {getCreateAccountData, getSavedAccount} from "./account";
import {UpdateAccountDto} from "../../../src/modules/account/dto/update-account-dto";
import {getSelectQueryDto} from "../../common/const";

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

    describe('selectList()', () => {
        it('가계부 리스트 조회', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const response: SelectListResponseType<AccountEntity>
                = await accountController.selectAccountList(req, getSelectQueryDto());

            expect(response.items.every(v => v instanceof AccountEntity)).toBeTruthy();
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
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo,
                accountInfo: createdAccount
            };

            const response: ResponseBooleanType
                = await accountController.updateAccount(req, updateAccountDto, createdAccount.idx);

            expect(response.result).toBeTruthy();
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
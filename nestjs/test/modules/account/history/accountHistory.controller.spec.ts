import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {createRequest} from "node-mocks-http";
import {Request} from "express";
import {typeOrmOptions} from "../../../../config/config";
import {ResponseBooleanType, SelectListResponseType} from "../../../../src/common/type/type";
import {getSelectQueryDto} from "../../../common/const";
import {TokenRepository} from "../../../../src/modules/member/token/token.repository";
import {getSavedAccount} from "../account";
import {AccountHistoryController} from "../../../../src/modules/account/history/accountHistory.controller";
import {AccountHistoryService} from "../../../../src/modules/account/history/accountHistory.service";
import {AccountHistoryEntity} from "../../../../src/modules/account/history/entities/accountHistory.entity";
import {AccountEntity} from "../../../../src/modules/account/entities/account.entity";
import {AccountRepository} from "../../../../src/modules/account/account.repository";
import {AccountHistoryRepository} from "../../../../src/modules/account/history/accountHistory.repository";
import {AccountService} from "../../../../src/modules/account/account.service";
import {CreateAccountHistoryDto} from "../../../../src/modules/account/history/dto/create-accountHistory-dto";
import {getCreateAccountHistoryData} from "./accountHistory";
import {UpdateAccountHistoryDto} from "../../../../src/modules/account/history/dto/update-accountHistory-dto";

describe('AccountHistory Controller', () => {
    let accountHistoryController: AccountHistoryController;
    let accountHistoryService: AccountHistoryService;
    let createdAccountHistoryInfo: AccountHistoryEntity;
    const savedAccountInfo: AccountEntity = getSavedAccount();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                    AccountRepository,
                    AccountHistoryRepository
                ])
            ],
            controllers: [AccountHistoryController],
            providers: [
                AccountService,
                AccountHistoryService,
            ]
        }).compile();

        accountHistoryController = module.get<AccountHistoryController>(AccountHistoryController);
        accountHistoryService = module.get<AccountHistoryService>(AccountHistoryService);
    });

    describe('selectList()', () => {
        it('가계부 내역 리스트 조회', async () => {
            const req: Request = createRequest();

            req.locals = {
                accountInfo: savedAccountInfo
            };

            const response: SelectListResponseType<AccountHistoryEntity>
                = await accountHistoryController.selectAccountHistoryList(req, getSelectQueryDto());

            expect(response.items.every(v => v instanceof AccountHistoryEntity)).toBeTruthy();
        });
    });

    describe('createAccountHistory()', () => {
        it('가계부 내역 등록', async () => {
            const req: Request = createRequest();

            req.locals = {
                accountInfo: savedAccountInfo
            };

            const createAccountHistoryDto: CreateAccountHistoryDto = getCreateAccountHistoryData();

            const response: AccountHistoryEntity = await accountHistoryController.createAccountHistory(req, createAccountHistoryDto);

            expect(response instanceof AccountHistoryEntity).toBeTruthy();

            createdAccountHistoryInfo = response;
        });
    });

    describe('updateAccountHistory()', () => {
        it('가계부 내역 수정', async () => {
            const updateAccountHistoryDto: UpdateAccountHistoryDto = {
                content: "수정된 가계부 내역 1",
                amount: 10000,
                type: 1
            };
            const req: Request = createRequest();

            req.locals = {
                accountHistoryInfo: createdAccountHistoryInfo
            };

            const response: ResponseBooleanType
                = await accountHistoryController.updateAccountHistory(req, updateAccountHistoryDto);
            const updatedAccountHistory: AccountHistoryEntity
                = await accountHistoryService.selectOne(
                createdAccountHistoryInfo.account, createdAccountHistoryInfo.idx
            );

            expect(response.result).toBeTruthy();
            expect(updatedAccountHistory.content === updateAccountHistoryDto.content).toBeTruthy();
            expect(Number(updatedAccountHistory.amount) === updateAccountHistoryDto.amount).toBeTruthy();
            expect(updatedAccountHistory.type === updateAccountHistoryDto.type).toBeTruthy();
        });
    });

    describe('deleteAccountHistory()', () => {
        it('가계부 내역 삭제', async () => {
            const req: Request = createRequest();

            req.locals = {
                accountHistoryInfo: createdAccountHistoryInfo
            };

            const response: ResponseBooleanType
                = await accountHistoryController.deleteAccountHistory(req);

            expect(response.result).toBeTruthy();
        });
    });


});
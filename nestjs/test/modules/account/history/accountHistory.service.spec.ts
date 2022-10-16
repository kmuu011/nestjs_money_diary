import {getCreateAccountHistoryDto, getSavedAccountHistory} from "./accountHistory";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../../config/config";
import {AccountIncomeOutcomeType, SelectListResponseType} from "../../../../src/common/type/type";
import {DeleteResult, UpdateResult} from "typeorm";
import {getSavedAccount} from "../account";
import {AccountEntity} from "../../../../src/modules/account/entities/account.entity";
import {AccountHistoryEntity} from "../../../../src/modules/account/history/entities/accountHistory.entity";
import {AccountHistoryService} from "../../../../src/modules/account/history/accountHistory.service";
import {AccountHistoryRepository} from "../../../../src/modules/account/history/accountHistory.repository";
import {CreateAccountHistoryDto} from "../../../../src/modules/account/history/dto/create-accountHistory-dto";
import {UpdateAccountHistoryDto} from "../../../../src/modules/account/history/dto/update-accountHistory-dto";
import {AccountRepository} from "../../../../src/modules/account/account.repository";
import {AccountService} from "../../../../src/modules/account/account.service";
import {savedAccountHistoryCategoryData} from "./category/accountHistoryCategory";
import {
    AccountHistoryCategoryRepository
} from "../../../../src/modules/account/history/category/accountHistoryCategory.repository";

describe('AccountHistory Service', () => {
    const savedAccountInfo: AccountEntity = getSavedAccount();
    const savedAccountHistoryInfo: AccountHistoryEntity = getSavedAccountHistory();
    let accountService: AccountService;
    let accountHistoryService: AccountHistoryService;
    let createdAccountHistoryInfo: AccountHistoryEntity;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    AccountRepository,
                    AccountHistoryRepository,
                    AccountHistoryCategoryRepository
                ])
            ],
            providers: [
                AccountService,
                AccountHistoryService,
            ]
        }).compile();

        accountHistoryService = module.get<AccountHistoryService>(AccountHistoryService);
        accountService = module.get<AccountService>(AccountService);
    });

    describe('selectOne()', () => {
        it('가계부 내역 상세 조회', async () => {
            const accountHistory: AccountHistoryEntity =
                await accountHistoryService.selectOne(
                    savedAccountInfo,
                    savedAccountHistoryInfo.idx
                );

            expect(accountHistory instanceof AccountHistoryEntity).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('가계부 내역 리스트 조회', async () => {
            const accountHistoryList: SelectListResponseType<AccountHistoryEntity>
                = await accountHistoryService
                .selectList(savedAccountInfo, 0, 1, 10, savedAccountHistoryCategoryData.idx);

            expect(accountHistoryList.items.every(t => t instanceof AccountHistoryEntity)).toBeTruthy();
        });
    });

    describe('create()', () => {
        it('가계부 내역 등록', async () => {
            const fixedAt: string = '2021.03.06';

            const createAccountHistoryDto: CreateAccountHistoryDto = getCreateAccountHistoryDto();

            const createResult: AccountHistoryEntity
                = await accountHistoryService.create(
                savedAccountInfo,
                createAccountHistoryDto
            );

            expect(Date.now() - new Date(createResult.createdAt).getTime()).toBeTruthy();

            createdAccountHistoryInfo = createResult;

            const updatedAccountInfo: AccountEntity
                = await accountService.selectOne(savedAccountInfo.member, savedAccountInfo.idx);

            const accountIncomeOutcome: AccountIncomeOutcomeType
                = await accountService.selectIncomeOutcome(undefined, savedAccountInfo);

            expect(createResult instanceof AccountHistoryEntity).toBeTruthy();
            expect(
                Number(updatedAccountInfo.totalAmount) ===
                Number(accountIncomeOutcome.income) - Number(accountIncomeOutcome.outcome)
            ).toBeTruthy();

            createAccountHistoryDto.createdAt = new Date(fixedAt).toISOString();

            const createFixedTimeResult: AccountHistoryEntity = await accountHistoryService
                .create(
                    savedAccountInfo,
                    createAccountHistoryDto
                )

            expect(
                new Date(createFixedTimeResult.createdAt).getTime()
                === new Date(createAccountHistoryDto.createdAt).getTime()
            )
        });
    });

    describe('update()', () => {
        it('가계부 내역 수정', async () => {
            const fixedAt: string = '2021.01.01';

            const updateAccountHistoryDto: UpdateAccountHistoryDto = {
                content: "수정된 가계부 내역 내용",
                amount: 10000,
                type: 1,
                accountHistoryCategoryIdx: savedAccountHistoryCategoryData.idx,
                createdAt: new Date(fixedAt).toISOString()
            };

            const updateResult: UpdateResult
                = await accountHistoryService.update(createdAccountHistoryInfo, updateAccountHistoryDto);

            const updatedAccountInfo: AccountEntity
                = await accountService.selectOne(savedAccountInfo.member, savedAccountInfo.idx);

            const updatedAccountHistory: AccountHistoryEntity
                = await accountHistoryService.selectOne(
                createdAccountHistoryInfo.account,
                createdAccountHistoryInfo.idx
            );

            const accountIncomeOutcome: AccountIncomeOutcomeType
                = await accountService.selectIncomeOutcome(undefined, savedAccountInfo);

            expect(updateResult.affected === 1).toBeTruthy();
            expect(updatedAccountHistory.content === updateAccountHistoryDto.content).toBeTruthy();
            expect(Number(updatedAccountHistory.amount) === updateAccountHistoryDto.amount).toBeTruthy();
            expect(updatedAccountHistory.type === updateAccountHistoryDto.type).toBeTruthy();
            expect(
                Number(updatedAccountInfo.totalAmount) ===
                Number(accountIncomeOutcome.income) - Number(accountIncomeOutcome.outcome)
            ).toBeTruthy();

            expect(
                new Date(updatedAccountHistory.createdAt).getTime()
                === new Date(updateAccountHistoryDto.createdAt).getTime()
            ).toBeTruthy();
        });
    });

    describe('delete()', () => {
        it('가계부 내역 삭제', async () => {
            const deleteResult: DeleteResult = await accountHistoryService.delete(createdAccountHistoryInfo);

            const updatedAccountInfo: AccountEntity
                = await accountService.selectOne(savedAccountInfo.member, savedAccountInfo.idx);

            const accountIncomeOutcome: AccountIncomeOutcomeType
                = await accountService.selectIncomeOutcome(undefined, savedAccountInfo);

            expect(deleteResult.affected === 1).toBeTruthy();

            expect(
                Number(updatedAccountInfo.totalAmount) ===
                Number(accountIncomeOutcome.income) - Number(accountIncomeOutcome.outcome)
            ).toBeTruthy();
        });
    });

});
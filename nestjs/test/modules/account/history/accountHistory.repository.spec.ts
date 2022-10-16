import {Test, TestingModule} from "@nestjs/testing";
import {DeleteResult, UpdateResult} from "typeorm";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../../config/config";
import {AccountRepository} from "../../../../src/modules/account/account.repository";
import {getCreateAccountHistoryEntity, getSavedAccountHistory} from "./accountHistory";
import {getSavedAccount} from "../account";
import {AccountEntity} from "../../../../src/modules/account/entities/account.entity";
import {AccountHistoryEntity} from "../../../../src/modules/account/history/entities/accountHistory.entity";
import {AccountHistoryRepository} from "../../../../src/modules/account/history/accountHistory.repository";
import {UpdateAccountHistoryDto} from "../../../../src/modules/account/history/dto/update-accountHistory-dto";
import {getSavedAccountHistoryCategory, savedAccountHistoryCategoryData} from "./category/accountHistoryCategory";

describe('AccountHistory Repository', () => {
    const savedAccountInfo: AccountEntity = getSavedAccount();
    const savedAccountHistoryInfo: AccountHistoryEntity = getSavedAccountHistory();

    let accountRepository: AccountRepository;
    let accountHistoryRepository: AccountHistoryRepository;
    let createdAccountHistoryInfo: AccountHistoryEntity;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    AccountRepository,
                    AccountHistoryRepository
                ])
            ],
        }).compile()

        accountRepository = module.get<AccountRepository>(AccountRepository);
        accountHistoryRepository = module.get<AccountHistoryRepository>(AccountHistoryRepository);

        for (let i = 0; i < 4; i++) {
            savedAccountHistoryInfo.idx = i + 1;
            const accountHistory: AccountHistoryEntity = await accountHistoryRepository.selectOne(savedAccountInfo, savedAccountHistoryInfo.idx);

            if (accountHistory) continue;

            await accountHistoryRepository.createAccountHistory(undefined, savedAccountHistoryInfo);
        }

        savedAccountHistoryInfo.idx = (getSavedAccountHistory()).idx;
    });

    describe('selectOne()', () => {
        it('가계부 내역 상세 조회', async () => {
            const result: AccountHistoryEntity =
                await accountHistoryRepository
                    .selectOne(savedAccountInfo, savedAccountHistoryInfo.idx);

            expect(result instanceof AccountHistoryEntity).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('가계부 내역 목록 조회', async () => {
            const result: [AccountHistoryEntity[], number] =
                await accountHistoryRepository
                    .selectList(savedAccountInfo, 0, 1, 10, getSavedAccountHistoryCategory());

            expect(result[0].every(v => v instanceof AccountHistoryEntity)).toBeTruthy();
            expect(typeof result[1] === "number").toBeTruthy();
        });
    });

    describe('createAccountHistory()', () => {
        it('가계부 내역 등록', async () => {
            const accountHistory: AccountHistoryEntity = getCreateAccountHistoryEntity();

            const createResult: AccountHistoryEntity = await accountHistoryRepository
                .createAccountHistory(
                    undefined,
                    accountHistory
                );

            expect(createResult instanceof AccountHistoryEntity).toBeTruthy();
            expect(Date.now() - new Date(createResult.createdAt).getTime()).toBeTruthy();

            const fixedAt: string = '2021.06.06'

            accountHistory.createdAt = new Date(fixedAt).toISOString();

            const createFixedTimeResult: AccountHistoryEntity = await accountHistoryRepository
                .createAccountHistory(
                    undefined,
                    accountHistory
                );

            expect(new Date(createFixedTimeResult.createdAt).getTime() === new Date(fixedAt).getTime()).toBeTruthy();

            createdAccountHistoryInfo = createResult;
        });
    });

    describe('updateAccountHistory()', () => {
        it('가계부 내역 수정', async () => {
            const fixedAt: string = '2021.01.01';

            const updateAccountHistoryDto: UpdateAccountHistoryDto = {
                content: '수정된 가계부 내역 내용',
                amount: 10000,
                type: 1,
                accountHistoryCategoryIdx: savedAccountHistoryCategoryData.idx,
                createdAt: new Date(fixedAt).toISOString()
            };

            const updateResult: UpdateResult
                = await accountHistoryRepository.updateAccountHistory(createdAccountHistoryInfo, updateAccountHistoryDto);
            const updatedAccountHistory: AccountHistoryEntity
                = await accountHistoryRepository.selectOne(createdAccountHistoryInfo.account, createdAccountHistoryInfo.idx);

            expect(updateResult.affected === 1).toBeTruthy();
            expect(updatedAccountHistory.content === updateAccountHistoryDto.content).toBeTruthy();
            expect(Number(updatedAccountHistory.amount) === updateAccountHistoryDto.amount).toBeTruthy();
            expect(updatedAccountHistory.type === updateAccountHistoryDto.type).toBeTruthy();
            expect(
                new Date(updatedAccountHistory.createdAt).getTime()
                === new Date(updateAccountHistoryDto.createdAt).getTime()
            ).toBeTruthy();
        });
    });

    describe('deleteAccountHistory()', () => {
        it('가계부 내역 삭제', async () => {
            const deleteResult: DeleteResult
                = await accountHistoryRepository.deleteAccountHistory(createdAccountHistoryInfo);

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });

});
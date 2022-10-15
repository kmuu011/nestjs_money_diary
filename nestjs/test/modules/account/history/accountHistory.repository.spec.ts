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
import {savedAccountHistoryCategoryData} from "./category/accountHistoryCategory";

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
            const result: AccountHistoryEntity = await accountHistoryRepository.selectOne(savedAccountInfo, savedAccountHistoryInfo.idx);

            expect(result instanceof AccountHistoryEntity).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('가계부 내역 목록 조회', async () => {
            const result: [AccountHistoryEntity[], number] = await accountHistoryRepository.selectList(savedAccountInfo, 1, 10);

            expect(result[0].every(v => v instanceof AccountHistoryEntity)).toBeTruthy();
            expect(typeof result[1] === "number").toBeTruthy();
        });
    });

    describe('createAccountHistory()', () => {
        it('가계부 내역 등록', async () => {
            const accountHistory: AccountHistoryEntity = getCreateAccountHistoryEntity();

            const result: AccountHistoryEntity = await accountHistoryRepository
                .createAccountHistory(
                    undefined,
                    accountHistory
                );

            expect(result instanceof AccountHistoryEntity).toBeTruthy();

            createdAccountHistoryInfo = result;
        });
    });

    describe('updateAccountHistory()', () => {
        it('가계부 내역 수정', async () => {
            const updateAccountHistoryDto: UpdateAccountHistoryDto = {
                content: '수정된 가계부 내역 내용',
                amount: 10000,
                type: 1,
                accountHistoryCategoryIdx: savedAccountHistoryCategoryData.idx
            };

            const updateResult: UpdateResult
                = await accountHistoryRepository.updateAccountHistory(createdAccountHistoryInfo, updateAccountHistoryDto);
            const updatedAccountHistory: AccountHistoryEntity
                = await accountHistoryRepository.selectOne(createdAccountHistoryInfo.account, createdAccountHistoryInfo.idx);

            expect(updateResult.affected === 1).toBeTruthy();
            expect(updatedAccountHistory.content === updateAccountHistoryDto.content).toBeTruthy();
            expect(Number(updatedAccountHistory.amount) === updateAccountHistoryDto.amount).toBeTruthy();
            expect(updatedAccountHistory.type === updateAccountHistoryDto.type).toBeTruthy();
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
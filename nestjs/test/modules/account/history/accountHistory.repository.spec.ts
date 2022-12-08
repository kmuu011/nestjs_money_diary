import {Test, TestingModule} from "@nestjs/testing";
import {DeleteResult, getConnection, QueryRunner, UpdateResult} from "typeorm";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../../config/config";
import {AccountRepository} from "../../../../src/modules/account/account.repository";
import {getCreateAccountHistoryEntity, getSavedAccountHistory} from "./accountHistory";
import {getSavedAccount} from "../account";
import {AccountEntity} from "../../../../src/modules/account/entities/account.entity";
import {AccountHistoryEntity} from "../../../../src/modules/account/history/entities/accountHistory.entity";
import {AccountHistoryRepository} from "../../../../src/modules/account/history/accountHistory.repository";
import {UpdateAccountHistoryDto} from "../../../../src/modules/account/history/dto/update-accountHistory-dto";
import {
    getCreateAccountHistoryCategoryData,
    getSavedAccountHistoryCategory,
    savedAccountHistoryCategoryData
} from "./category/accountHistoryCategory";
import {
    AccountHistoryCategoryRepository
} from "../../../../src/modules/account/history/category/accountHistoryCategory.repository";
import {MemberEntity} from "../../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../../member/member";
import {
    AccountHistoryCategoryEntity
} from "../../../../src/modules/account/history/category/entities/accountHistoryCategory.entity";

describe('AccountHistory Repository', () => {
    const savedAccountInfo: AccountEntity = getSavedAccount();
    const savedAccountHistoryInfo: AccountHistoryEntity = getSavedAccountHistory();
    const savedMemberInfo: MemberEntity = getSavedMember();

    let accountRepository: AccountRepository;
    let accountHistoryRepository: AccountHistoryRepository;
    let accountHistoryCategoryRepository: AccountHistoryCategoryRepository;
    let createdAccountHistoryInfo: AccountHistoryEntity;
    let connection;

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
        }).compile();

        accountRepository = module.get<AccountRepository>(AccountRepository);
        accountHistoryRepository = module.get<AccountHistoryRepository>(AccountHistoryRepository);
        accountHistoryCategoryRepository = module.get<AccountHistoryCategoryRepository>(AccountHistoryCategoryRepository);

        for (let i = 0; i < 4; i++) {
            savedAccountHistoryInfo.idx = i + 1;
            const accountHistory: AccountHistoryEntity = await accountHistoryRepository.selectOne(savedAccountInfo, savedAccountHistoryInfo.idx);

            if (accountHistory) continue;

            await accountHistoryRepository.createAccountHistory(undefined, savedAccountHistoryInfo);
        }

        savedAccountHistoryInfo.idx = (getSavedAccountHistory()).idx;

        connection = getConnection();
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
                    .selectList(
                        [savedAccountInfo.idx.toString()],
                        0, 0, 10,
                        [getSavedAccountHistoryCategory().idx.toString()]
                    );

            expect(result[0].every(v => v instanceof AccountHistoryEntity)).toBeTruthy();
            expect(typeof result[1] === "number").toBeTruthy();
        });
    });

    describe('createAccountHistory()', () => {
        it('가계부 내역 등록', async () => {
            const accountHistory: AccountHistoryEntity = getCreateAccountHistoryEntity();

            const insertedAccountHistory: AccountHistoryEntity =
                await accountHistoryRepository.selectOne(savedAccountInfo, accountHistory.idx);

            if (insertedAccountHistory) {
                await accountHistoryRepository.deleteAccountHistory(accountHistory);
            }

            const createResult: AccountHistoryEntity = await accountHistoryRepository
                .createAccountHistory(
                    undefined,
                    accountHistory
                );

            expect(createResult instanceof AccountHistoryEntity).toBeTruthy();
            expect(Date.now() - new Date(createResult.createdAt).getTime()).toBeTruthy();

            const fixedAt: string = '2021.06.06';

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

    describe('migrationAccountHistoryCategory()', () => {
        it('가계부 내역 카테고리 마이그레이션', async () => {
            const queryRunner: QueryRunner = connection.createQueryRunner();
            await queryRunner.startTransaction();

            let migrationResult: UpdateResult;

            try {
                const targetCategory: AccountHistoryCategoryEntity =
                    await accountHistoryCategoryRepository
                        .createAccountHistoryCategory(undefined,
                            getCreateAccountHistoryCategoryData(1001)
                        );

                const tempHistory: AccountHistoryEntity = getCreateAccountHistoryEntity();
                tempHistory.idx = undefined;
                tempHistory.accountHistoryCategory = targetCategory;

                const createdHistory: AccountHistoryEntity =
                    await accountHistoryRepository.createAccountHistory(undefined,
                        tempHistory
                    );

                const defaultCategory = await accountHistoryCategoryRepository
                    .selectOne(savedMemberInfo, undefined, 0, '기타');

                migrationResult = await accountHistoryRepository
                    .migrationAccountHistoryCategory(
                        queryRunner,
                        savedMemberInfo.idx,
                        targetCategory.idx,
                        defaultCategory.idx
                    );

                expect(migrationResult.affected.constructor === Number).toBeTruthy();

                await queryRunner.commitTransaction();

                const migratedHistory =
                    await accountHistoryRepository.selectOne(savedAccountInfo, createdHistory.idx);

                expect(migratedHistory.accountHistoryCategory.idx === defaultCategory.idx).toBeTruthy();
            } catch (e) {
                await queryRunner.rollbackTransaction();
            } finally {
                await queryRunner.release();
            }
        });
    });

    describe('deleteAccountHistory()', () => {
        it('가계부 내역 삭제', async () => {
            const queryRunner: QueryRunner = connection.createQueryRunner();
            await queryRunner.startTransaction();

            let deleteResult: DeleteResult;

            try {
                deleteResult = await accountHistoryRepository.deleteAccountHistory(createdAccountHistoryInfo);
                await queryRunner.commitTransaction();
            } catch (e) {
                await queryRunner.rollbackTransaction();
            } finally {
                await queryRunner.release();
            }

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });

});
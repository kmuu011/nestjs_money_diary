import {getCreateAccountHistoryData, getSavedAccountHistory} from "./accountHistory";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../../config/config";
import {SelectListResponseType} from "../../../../src/common/type/type";
import {DeleteResult, UpdateResult} from "typeorm";
import {getSavedAccount} from "../account";
import {AccountEntity} from "../../../../src/modules/account/entities/account.entity";
import {AccountHistoryEntity} from "../../../../src/modules/account/history/entities/accountHistory.entity";
import {AccountHistoryService} from "../../../../src/modules/account/history/accountHistory.service";
import {AccountHistoryRepository} from "../../../../src/modules/account/history/accountHistory.repository";
import {CreateAccountHistoryDto} from "../../../../src/modules/account/history/dto/create-accountHistory-dto";
import {UpdateAccountHistoryDto} from "../../../../src/modules/account/history/dto/update-accountHistory-dto";

describe('AccountHistory Service', () => {
    const savedAccountInfo: AccountEntity = getSavedAccount();
    const savedAccountHistoryInfo: AccountHistoryEntity = getSavedAccountHistory();
    let accountHistoryService: AccountHistoryService;
    let createdAccountHistoryInfo: AccountHistoryEntity;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    AccountHistoryRepository,
                ])
            ],
            providers: [
                AccountHistoryService,
            ]
        }).compile();

        accountHistoryService = module.get<AccountHistoryService>(AccountHistoryService);
    });

    describe('selectOne()', () => {
        it('가계부 내역 상세 조회', async () => {
            const accountHistory: AccountHistoryEntity = await accountHistoryService.selectOne(savedAccountInfo, savedAccountHistoryInfo.idx);

            expect(accountHistory instanceof AccountHistoryEntity).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('가계부 내역 리스트 조회', async () => {
            const accountHistoryList: SelectListResponseType<AccountHistoryEntity>
                = await accountHistoryService.selectList(savedAccountInfo, 1, 10);

            expect(accountHistoryList.items.every(t => t instanceof AccountHistoryEntity)).toBeTruthy();
        });
    });

    describe('create()', () => {
        it('가계부 내역 등록', async () => {
            const createAccountHistoryDto: CreateAccountHistoryDto = getCreateAccountHistoryData();
            const insertResult: AccountHistoryEntity = await accountHistoryService.create(savedAccountInfo, createAccountHistoryDto);

            expect(insertResult instanceof AccountHistoryEntity).toBeTruthy();

            createdAccountHistoryInfo = insertResult;
        });
    });

    describe('update()', () => {
        it('가계부 내역 수정', async () => {
            const updateAccountHistoryDto: UpdateAccountHistoryDto = {
                content: "수정된 가계부 내역 내용",
                amount: 10000,
                type: 1
            };

            const updateResult: UpdateResult = await accountHistoryService.update(createdAccountHistoryInfo, updateAccountHistoryDto);
            const updatedAccountHistory: AccountHistoryEntity
                = await accountHistoryService.selectOne(
                createdAccountHistoryInfo.account,
                createdAccountHistoryInfo.idx
            );

            expect(updateResult.affected === 1).toBeTruthy();
            expect(updatedAccountHistory.content === updateAccountHistoryDto.content).toBeTruthy();
            expect(Number(updatedAccountHistory.amount) === updateAccountHistoryDto.amount).toBeTruthy();
            expect(updatedAccountHistory.type === updateAccountHistoryDto.type).toBeTruthy();
        });
    });

    describe('delete()', () => {
        it('가계부 내역 삭제', async () => {
            const deleteResult: DeleteResult = await accountHistoryService.delete(createdAccountHistoryInfo);

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });

});
import {getSavedMember} from "../member/member";
import {Test, TestingModule} from "@nestjs/testing";
import {MemberEntity} from "../../../src/modules/member/entities/member.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../config/config";
import {
    AccountIncomeOutcomeType,
    CursorSelectListResponseType,
} from "../../../src/common/type/type";
import {DeleteResult, UpdateResult} from "typeorm";
import {AccountEntity} from "../../../src/modules/account/entities/account.entity";
import {
    accountMonthSummaryDto,
    getCreateAccountData,
    getSavedAccount,
    monthDailySummaryDataKeyList,
    monthSummaryDataKeyList
} from "./account";
import {AccountService} from "../../../src/modules/account/account.service";
import {AccountRepository} from "../../../src/modules/account/account.repository";
import {CreateAccountDto} from "../../../src/modules/account/dto/create-account-dto";
import {UpdateAccountDto} from "../../../src/modules/account/dto/update-account-dto";
import {createRandomString} from "../../../libs/utils";
import {dataExpect} from "../../../libs/test";

describe('Account Service', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedAccountInfo: AccountEntity = getSavedAccount();

    let accountService: AccountService;
    let createdAccount: AccountEntity;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    AccountRepository,
                ])
            ],
            providers: [
                AccountService,
            ]
        }).compile();

        accountService = module.get<AccountService>(AccountService);
    });

    describe('arrangeOrder()', () => {
        it('가계부 순서 정렬', async () => {
            const insertedDummyAccountList: AccountEntity[] = [];
            const insertDummyCount: number = Math.ceil(Math.random()*10)+1;
            const account: AccountEntity = getSavedAccount();

            for(let i=0 ; i<insertDummyCount ; i++){
                account.idx = i+33;
                insertedDummyAccountList.push(await accountService.create(savedMemberInfo, account));
            }

            account.idx = 2;

            const accountStatus: CursorSelectListResponseType<AccountEntity> =
                await accountService.selectList(savedMemberInfo, 0, undefined, 100);

            const totalCount: number = accountStatus.totalCount;
            const randomOrder: number = Math.ceil(Math.random()*totalCount)+1;

            await accountService.arrangeOrder(savedMemberInfo, account, randomOrder);

            const orderChangedAccountList: CursorSelectListResponseType<AccountEntity> =
                await accountService.selectList(savedMemberInfo, 0, undefined,100);

            expect(orderChangedAccountList.items.findIndex(t => t.order === randomOrder) === randomOrder-1).toBeTruthy();

            for(const t of insertedDummyAccountList){
                await accountService.delete(savedMemberInfo, t);
            }
        });
    });

    describe('selectMonthSummary()', () => {
        it('가계부 월별 요약 조회', async () => {
            const accountMonthSummary = await accountService.selectMonthSummary(
                savedMemberInfo,
                accountMonthSummaryDto.year,
                accountMonthSummaryDto.month,
                accountMonthSummaryDto.startDate,
                accountMonthSummaryDto.endDate,
                accountMonthSummaryDto.multipleAccountIdx
            );

            dataExpect(monthDailySummaryDataKeyList, accountMonthSummary.accountHistoryMonthDailySummary);
            dataExpect(monthSummaryDataKeyList, [accountMonthSummary.accountHistoryMonthSummary]);
        });
    });

    describe('accountIncomeOutcome()', () => {
        it('가계부 현재 총 지출, 수입 조회', async () => {
            const accountIncomeOutcome: AccountIncomeOutcomeType
                = await accountService.selectIncomeOutcome(undefined, savedAccountInfo);

            expect(accountIncomeOutcome.income !== undefined).toBeTruthy();
            expect(accountIncomeOutcome.outcome!== undefined).toBeTruthy();
        });
    });

    describe('resetTotalAmount()', () => {
        it('가계부 금액 재설정', async () => {
            await accountService.resetTotalAmount(undefined, savedAccountInfo);

            const accountInfo: AccountEntity = await accountService.selectOne(savedMemberInfo, savedAccountInfo.idx);

            const accountIncomeOutcome: AccountIncomeOutcomeType
                = await accountService.selectIncomeOutcome(undefined, savedAccountInfo);

            expect(
                Number(accountInfo.totalAmount) ===
                Number(accountIncomeOutcome.income) - Number(accountIncomeOutcome.outcome)
            ).toBeTruthy();
        });
    });

    describe('selectOne()', () => {
        it('가계부 상세 조회', async () => {
            const account: AccountEntity = await accountService.selectOne(savedMemberInfo, savedAccountInfo.idx);

            expect(account instanceof AccountEntity).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('가계부 리스트 조회', async () => {
            const accountList: CursorSelectListResponseType<AccountEntity>
                = await accountService.selectList(savedMemberInfo, 0, undefined, 10);

            expect(accountList.items.every(t => t instanceof AccountEntity)).toBeTruthy();
        });
    });

    describe('create()', () => {
        it('가계부 등록', async () => {
            const createAccountDto: CreateAccountDto = getCreateAccountData();
            const insertResult: AccountEntity = await accountService.create(savedMemberInfo, createAccountDto);

            expect(insertResult instanceof AccountEntity).toBeTruthy();

            createdAccount = insertResult;
        });
    });

    describe('update()', () => {
        it('가계부 수정', async () => {
            const updateAccountDto: UpdateAccountDto = getCreateAccountData();
            const newAccountName: string = `수정된 가계부 ${createRandomString(6)}`;
            const newInvisibleAmount: number = 1;
            updateAccountDto.accountName = newAccountName;
            updateAccountDto.invisibleAmount = newInvisibleAmount;

            const updateResult: UpdateResult = await accountService.update(savedMemberInfo, createdAccount, updateAccountDto);
            const updatedAccount: AccountEntity = await accountService.selectOne(savedMemberInfo, createdAccount.idx);

            expect(updateResult.affected === 1).toBeTruthy();
            expect(updatedAccount.accountName === newAccountName).toBeTruthy();
            expect(updatedAccount.invisibleAmount === newInvisibleAmount).toBeTruthy();
        });
    });

    describe('delete()', () => {
        it('가계부 등록', async () => {
            const deleteResult: DeleteResult = await accountService.delete(savedMemberInfo, createdAccount);

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });

});
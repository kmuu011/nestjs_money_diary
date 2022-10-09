import {getSavedMember} from "../member/member";
import {Test, TestingModule} from "@nestjs/testing";
import {MemberEntity} from "../../../src/modules/member/entities/member.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../config/config";
import {SelectListResponseType} from "../../../src/common/type/type";
import {DeleteResult, UpdateResult} from "typeorm";
import {AccountEntity} from "../../../src/modules/account/entities/account.entity";
import {getCreateAccountData, getSavedAccount} from "./account";
import {AccountService} from "../../../src/modules/account/account.service";
import {AccountRepository} from "../../../src/modules/account/account.repository";
import {CreateAccountDto} from "../../../src/modules/account/dto/create-account-dto";
import {UpdateAccountDto} from "../../../src/modules/account/dto/update-account-dto";

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
                    AccountRepository
                ])
            ],
            providers: [
                AccountService,
            ]
        }).compile();

        accountService = module.get<AccountService>(AccountService)
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

            const accountStatus: SelectListResponseType<AccountEntity> =
                await accountService.selectList(savedMemberInfo, 1, 100);

            const totalCount: number = accountStatus.totalCount;
            const randomOrder: number = Math.ceil(Math.random()*totalCount)+1;

            await accountService.arrangeOrder(savedMemberInfo, account, randomOrder);

            const orderChangedAccountList: SelectListResponseType<AccountEntity> =
                await accountService.selectList(savedMemberInfo, 1, 100);

            expect(orderChangedAccountList.items.findIndex(t => t.order === randomOrder) === totalCount-randomOrder).toBeTruthy();

            for(const t of insertedDummyAccountList){
                await accountService.delete(savedMemberInfo, t);
            }
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
            const accountList: SelectListResponseType<AccountEntity>
                = await accountService.selectList(savedMemberInfo, 1, 10);

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
            const updateResult: UpdateResult = await accountService.update(savedMemberInfo, createdAccount, updateAccountDto);

            expect(updateResult.affected === 1).toBeTruthy();
        });
    });

    describe('delete()', () => {
        it('가계부 등록', async () => {
            const deleteResult: DeleteResult = await accountService.delete(savedMemberInfo, createdAccount);

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });

});
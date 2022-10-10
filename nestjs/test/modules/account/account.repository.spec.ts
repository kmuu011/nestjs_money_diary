import {MemberEntity} from "../../../src/modules/member/entities/member.entity";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DeleteResult, UpdateResult} from "typeorm";
import {typeOrmOptions} from "../../../config/config";
import {AccountRepository} from "../../../src/modules/account/account.repository";
import {getSavedMember} from "../member/member";
import {AccountEntity} from "../../../src/modules/account/entities/account.entity";
import {getCreateAccountData, getSavedAccount} from "./account";
import {createRandomString} from "../../../libs/utils";

describe('Account Repository', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedAccountInfo: AccountEntity = getSavedAccount();

    let accountRepository: AccountRepository;
    let createdAccountInfo: AccountEntity;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    AccountRepository
                ])
            ],
        }).compile();

        accountRepository = module.get<AccountRepository>(AccountRepository);

        for(let i=0 ; i<4 ; i++){
            savedAccountInfo.idx = i+1;
            const account: AccountEntity = await accountRepository.selectOne(savedMemberInfo, savedAccountInfo.idx);

            if (account) continue;

            await accountRepository.createAccount(undefined, savedAccountInfo);
        }

        savedAccountInfo.idx = (getSavedAccount()).idx;
    });

    describe('selectOne()', () => {
        it('가계부 상세 조회', async () => {
            const result: AccountEntity = await accountRepository.selectOne(savedMemberInfo, savedAccountInfo.idx);

            expect(result instanceof AccountEntity).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('가계부 조회', async () => {
            const result: [AccountEntity[], number] = await accountRepository.selectList(savedMemberInfo);

            expect(result[0].every(v => v instanceof AccountEntity)).toBeTruthy();
            expect(typeof result[1] === "number").toBeTruthy();
        });
    });

    describe('create()', () => {
        it('가계부 등록', async () => {
            const createAccountData: AccountEntity = getCreateAccountData();

            const insertResult: AccountEntity = await accountRepository.createAccount(undefined, createAccountData);

            expect(insertResult instanceof AccountEntity).toBeTruthy();

            createdAccountInfo = await accountRepository.selectOne(insertResult.member, insertResult.idx);
            createdAccountInfo.member = insertResult.member;
        });
    });

    describe('update()', () => {
        it('가계부 수정', async () => {
            createdAccountInfo.order++;

            const newAccountName: string = `수정된 가계부 ${createRandomString(6)}`;
            const newInvisibleAmount: number = 1;

            createdAccountInfo.accountName = newAccountName;
            createdAccountInfo.invisibleAmount = newInvisibleAmount;

            const updateResult: UpdateResult = await accountRepository.updateAccount(createdAccountInfo);
            const updatedAccount: AccountEntity = await accountRepository.selectOne(savedMemberInfo, createdAccountInfo.idx);

            expect(updateResult.affected === 1).toBeTruthy();
            expect(updatedAccount.accountName === newAccountName).toBeTruthy();
            expect(updatedAccount.invisibleAmount === newInvisibleAmount).toBeTruthy();
        });
    });

    describe('delete()', () => {
        it('가계부 삭제', async () => {
            const deleteResult: DeleteResult = await accountRepository.deleteAccount(createdAccountInfo);

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });
});
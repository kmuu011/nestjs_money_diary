import {Test, TestingModule} from "@nestjs/testing";
import {DeleteResult, UpdateResult} from "typeorm";
import {TypeOrmModule} from "@nestjs/typeorm";
import {
    AccountHistoryCategoryEntity
} from "../../../../../src/modules/account/history/category/entities/accountHistoryCategory.entity";
import {
    AccountHistoryCategoryRepository
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.repository";
import {MemberEntity} from "../../../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../../../member/member";
import {typeOrmOptions} from "../../../../../config/config";
import {
    getCreateAccountHistoryCategoryData,
    getSavedAccountHistoryCategory,
} from "./accountHistoryCategory";
import {
    UpdateAccountHistoryCategoryDto
} from "../../../../../src/modules/account/history/category/dto/update-accountHistoryCategory-dto";

describe('AccountHistoryCategory Repository', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedAccountHistoryCategoryInfo: AccountHistoryCategoryEntity = getSavedAccountHistoryCategory();

    let accountHistoryCategoryRepository: AccountHistoryCategoryRepository;
    let createdAccountHistoryCategoryInfo: AccountHistoryCategoryEntity;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    AccountHistoryCategoryRepository
                ])
            ],
        }).compile();

        accountHistoryCategoryRepository = module.get<AccountHistoryCategoryRepository>(AccountHistoryCategoryRepository);

        const accountHistoryCategory: AccountHistoryCategoryEntity =
            await accountHistoryCategoryRepository
                .selectOne(
                    savedMemberInfo,
                    savedAccountHistoryCategoryInfo.idx
                );

        if (!accountHistoryCategory) {
            await accountHistoryCategoryRepository
                .createAccountHistoryCategory(
                    undefined,
                    savedAccountHistoryCategoryInfo
                );
        }

    });

    describe('selectOne()', () => {
        it('가계부 내역 카테고리 카테고리 상세 조회', async () => {
            const result: AccountHistoryCategoryEntity =
                await accountHistoryCategoryRepository
                    .selectOne(
                        savedMemberInfo,
                        savedAccountHistoryCategoryInfo.idx
                    );

            expect(result instanceof AccountHistoryCategoryEntity).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('가계부 내역 카테고리 목록 조회', async () => {
            const result: AccountHistoryCategoryEntity[]
                = await accountHistoryCategoryRepository.selectList(savedMemberInfo, 0);

            expect(result.every(v => v instanceof AccountHistoryCategoryEntity)).toBeTruthy();
        });
    });

    describe('createAccountHistory()', () => {
        it('가계부 내역 카테고리 등록', async () => {
            const result: AccountHistoryCategoryEntity = await accountHistoryCategoryRepository
                .createAccountHistoryCategory(undefined, getCreateAccountHistoryCategoryData());

            expect(result instanceof AccountHistoryCategoryEntity).toBeTruthy();

            createdAccountHistoryCategoryInfo = result;
        });
    });

    describe('updateAccountHistory()', () => {
        it('가계부 내역 카테고리 수정', async () => {
            const updateAccountHistoryCategoryDto: UpdateAccountHistoryCategoryDto = {
                name: '용돈',
                color: 'aaaaaa',
                order: 2
            };

            const updateResult: UpdateResult
                = await accountHistoryCategoryRepository
                .updateAccountHistoryCategory(
                    createdAccountHistoryCategoryInfo,
                    updateAccountHistoryCategoryDto
                );

            const updatedAccountHistoryCategory: AccountHistoryCategoryEntity
                = await accountHistoryCategoryRepository
                .selectOne(
                    createdAccountHistoryCategoryInfo.member,
                    createdAccountHistoryCategoryInfo.idx
                );

            expect(updateResult.affected === 1).toBeTruthy();
            expect(updatedAccountHistoryCategory.name === updateAccountHistoryCategoryDto.name).toBeTruthy();
            expect(updatedAccountHistoryCategory.color === updateAccountHistoryCategoryDto.color).toBeTruthy();
            expect(updatedAccountHistoryCategory.order === updateAccountHistoryCategoryDto.order).toBeTruthy();
        });
    });

    describe('deleteAccountHistory()', () => {
        it('가계부 내역 카테고리 삭제', async () => {
            const deleteResult: DeleteResult
                = await accountHistoryCategoryRepository
                .deleteAccountHistoryCategory(createdAccountHistoryCategoryInfo);

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });

});
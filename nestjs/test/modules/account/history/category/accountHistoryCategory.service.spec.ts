import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DeleteResult, UpdateResult} from "typeorm";
import {
    AccountHistoryCategoryRepository
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.repository";
import {
    AccountHistoryCategoryService
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.service";
import {getSavedMember} from "../../../member/member";
import {MemberEntity} from "../../../../../src/modules/member/entities/member.entity";
import {
    getCreateAccountHistoryCategoryData,
    getSavedAccountHistoryCategory,
} from "./accountHistoryCategory";
import {
    AccountHistoryCategoryEntity
} from "../../../../../src/modules/account/history/category/entities/accountHistoryCategory.entity";
import {typeOrmOptions} from "../../../../../config/config";
import {
    CreateAccountHistoryCategoryDto
} from "../../../../../src/modules/account/history/category/dto/create-accountHistoryCategory-dto";
import {
    UpdateAccountHistoryCategoryDto
} from "../../../../../src/modules/account/history/category/dto/update-accountHistoryCategory-dto";
import {HttpException} from "@nestjs/common";
import {AccountHistoryRepository} from "../../../../../src/modules/account/history/accountHistory.repository";

describe('AccountHistoryCategory Service', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedAccountHistoryCategoryInfo: AccountHistoryCategoryEntity = getSavedAccountHistoryCategory();

    let accountHistoryCategoryService: AccountHistoryCategoryService;
    let createdAccountHistoryCategoryInfo: AccountHistoryCategoryEntity;

    const orderUpdater = async (i, targetCategory): Promise<void> => {
        const updateDto: UpdateAccountHistoryCategoryDto = {
            order: i+1
        };

        await accountHistoryCategoryService
            .update(targetCategory, updateDto);

        const updatedList: AccountHistoryCategoryEntity[] =
            await accountHistoryCategoryService.selectList(savedMemberInfo, 0);

        expect(updatedList[updatedList.findIndex(v => v.idx === targetCategory.idx)].order === updateDto.order)
            .toBeTruthy();
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    AccountHistoryCategoryRepository,
                    AccountHistoryRepository
                ])
            ],
            providers: [
                AccountHistoryCategoryService,
            ]
        }).compile();

        accountHistoryCategoryService = module.get<AccountHistoryCategoryService>(AccountHistoryCategoryService);
    });

    describe('arrangeOrder()', () => {
        it('가계부 내역 카테고리 순서 변경', async () => {
            const dummyCategoryList: AccountHistoryCategoryEntity[] = [];

            for(let i=0 ; i<4 ; i++){
                const insertedCategory:AccountHistoryCategoryEntity = await accountHistoryCategoryService.create(
                    savedMemberInfo,
                    {
                        type: 0,
                        name: "category" + i
                    }
                );

                dummyCategoryList.push(insertedCategory)
            }

            const totalCategoryList: AccountHistoryCategoryEntity[] =
                await accountHistoryCategoryService.selectList(savedMemberInfo, 0);
            const targetCategory: AccountHistoryCategoryEntity =
                totalCategoryList[1];

            for(let i=0 ; i<totalCategoryList.length ; i++){
                await orderUpdater(i, targetCategory);
            }

            for(let i=totalCategoryList.length-1 ; i>=0 ; i--){
                await orderUpdater(i, targetCategory);
            }

            for(const item of dummyCategoryList){
                await accountHistoryCategoryService.delete(item);
            }

            expect(true).toBeTruthy();
        });
    });

    describe('selectOne()', () => {
        it('가계부 내역 카테고리 상세 조회', async () => {
            const accountHistoryCategory: AccountHistoryCategoryEntity =
                await accountHistoryCategoryService.selectOne(
                    savedMemberInfo,
                    savedAccountHistoryCategoryInfo.idx
                );

            expect(accountHistoryCategory instanceof AccountHistoryCategoryEntity).toBeTruthy();
        });
    });

    describe('selectList()', () => {
        it('가계부 내역 카테고리 리스트 조회', async () => {
            const accountHistoryCategoryList: AccountHistoryCategoryEntity[]
                = await accountHistoryCategoryService
                .selectList(
                    savedMemberInfo,
                    0
                );


            expect(accountHistoryCategoryList.every(t => t instanceof AccountHistoryCategoryEntity)).toBeTruthy();
        });
    });

    describe('create()', () => {
        it('가계부 내역 카테고리 등록', async () => {
            const createAccountHistoryDto: CreateAccountHistoryCategoryDto = getCreateAccountHistoryCategoryData();

            const insertResult: AccountHistoryCategoryEntity
                = await accountHistoryCategoryService.create(savedMemberInfo, createAccountHistoryDto);
            createdAccountHistoryCategoryInfo = insertResult;

            expect(insertResult instanceof AccountHistoryCategoryEntity).toBeTruthy();
        });

        it('가계부 내역 카테고리 동일 이름 등록시 에러', async () => {
            const createAccountHistoryDto: CreateAccountHistoryCategoryDto = getCreateAccountHistoryCategoryData(113);

            try {
                await accountHistoryCategoryService.create(savedMemberInfo, createAccountHistoryDto);
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
            }
        });
    });

    describe('duplicateChecker()', () => {
        it('가계부 내역 카테고리 중복 체크', async () => {
            const duplicateResult: boolean = (await accountHistoryCategoryService
                .duplicateChecker(
                    savedMemberInfo,
                    createdAccountHistoryCategoryInfo.type,
                    createdAccountHistoryCategoryInfo.name
                )).isDuplicate;

            const notDuplicateResult: boolean = (await accountHistoryCategoryService
                .duplicateChecker(
                    savedMemberInfo,
                    createdAccountHistoryCategoryInfo.type,
                    createdAccountHistoryCategoryInfo.name + 'asdasd'
                )).isDuplicate;

            expect(duplicateResult).toBeTruthy();
            expect(notDuplicateResult).toBeFalsy();
        });
    });

    describe('update()', () => {
        it('가계부 내역 카테고리 수정', async () => {
            const updateAccountHistoryCategoryDto: UpdateAccountHistoryCategoryDto = {
                name: "용돈",
                color: "333333",
                order: 2
            };

            const updateResult: UpdateResult
                = await accountHistoryCategoryService
                .update(
                    createdAccountHistoryCategoryInfo,
                    updateAccountHistoryCategoryDto
                );

            expect(updateResult.affected === 1).toBeTruthy();
        });

        it('동일한 카테고리 명으로 수정시 에러', async () => {
            const dummyAccountHistoryCategoryDto: CreateAccountHistoryCategoryDto = {
                name: "테스트",
                type: 0
            };

            const insertedAccountHistoryCategory: AccountHistoryCategoryEntity =
                await accountHistoryCategoryService.create(savedMemberInfo, dummyAccountHistoryCategoryDto);

            const updateAccountHistoryCategoryDto: UpdateAccountHistoryCategoryDto = {
                name: "테스트",
                color: "333333",
                order: 2
            };

            try {
                await accountHistoryCategoryService
                    .update(
                        createdAccountHistoryCategoryInfo,
                        updateAccountHistoryCategoryDto
                    );
            } catch (e) {
                expect(e).toBeInstanceOf(HttpException);
            }

            await accountHistoryCategoryService.delete(insertedAccountHistoryCategory);
        });
    });

    describe('delete()', () => {
        it('가계부 내역 카테고리 삭제', async () => {
            const deleteResult: DeleteResult = await accountHistoryCategoryService
                .delete(
                    createdAccountHistoryCategoryInfo
                );

            expect(deleteResult.affected === 1).toBeTruthy();
        });
    });

});
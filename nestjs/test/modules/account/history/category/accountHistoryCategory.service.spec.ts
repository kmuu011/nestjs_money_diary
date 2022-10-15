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

describe('AccountHistoryCategory Service', () => {
    const savedMemberInfo: MemberEntity= getSavedMember();
    const savedAccountHistoryCategoryInfo: AccountHistoryCategoryEntity = getSavedAccountHistoryCategory();

    let accountHistoryCategoryService: AccountHistoryCategoryService;
    let createdAccountHistoryCategoryInfo: AccountHistoryCategoryEntity;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    AccountHistoryCategoryRepository,
                ])
            ],
            providers: [
                AccountHistoryCategoryService,
            ]
        }).compile();

        accountHistoryCategoryService = module.get<AccountHistoryCategoryService>(AccountHistoryCategoryService);
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
    });

    describe('update()', () => {
        it('가계부 내역 카테고리 수정', async () => {
            const updateAccountHistoryCategoryDto: UpdateAccountHistoryCategoryDto = {
                name: "용돈",
                type: 1,
                color: "333333"
            };

            const updateResult: UpdateResult
                = await accountHistoryCategoryService
                .update(
                    createdAccountHistoryCategoryInfo,
                    updateAccountHistoryCategoryDto
                );

            expect(updateResult.affected === 1).toBeTruthy();
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
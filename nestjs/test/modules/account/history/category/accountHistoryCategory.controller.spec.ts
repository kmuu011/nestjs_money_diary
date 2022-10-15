import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {createRequest} from "node-mocks-http";
import {Request} from "express";
import {
    AccountHistoryCategoryController
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.controller";
import {
    AccountHistoryCategoryService
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.service";
import {
    AccountHistoryCategoryEntity
} from "../../../../../src/modules/account/history/category/entities/accountHistoryCategory.entity";
import {typeOrmOptions} from "../../../../../config/config";
import {
    AccountHistoryCategoryRepository
} from "../../../../../src/modules/account/history/category/accountHistoryCategory.repository";
import {getSavedMember} from "../../../member/member";
import {MemberEntity} from "../../../../../src/modules/member/entities/member.entity";
import {getAccountHistoryCategorySelectQueryDto} from "./const/const";
import {
    CreateAccountHistoryCategoryDto
} from "../../../../../src/modules/account/history/category/dto/create-accountHistoryCategory-dto";
import {getCreateAccountHistoryCategoryData} from "./accountHistoryCategory";
import {
    UpdateAccountHistoryCategoryDto
} from "../../../../../src/modules/account/history/category/dto/update-accountHistoryCategory-dto";
import {ResponseBooleanType} from "../../../../../src/common/type/type";
import {TokenRepository} from "../../../../../src/modules/member/token/token.repository";

describe('AccountHistoryCategory Controller', () => {
    let accountHistoryCategoryController: AccountHistoryCategoryController;
    let accountHistoryCategoryService: AccountHistoryCategoryService;
    let createdAccountHistoryCategoryInfo: AccountHistoryCategoryEntity;

    const savedMemberInfo: MemberEntity = getSavedMember();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                    AccountHistoryCategoryRepository
                ])
            ],
            controllers: [AccountHistoryCategoryController],
            providers: [
                AccountHistoryCategoryService,
            ]
        }).compile();

        accountHistoryCategoryController = module.get<AccountHistoryCategoryController>(AccountHistoryCategoryController);
        accountHistoryCategoryService = module.get<AccountHistoryCategoryService>(AccountHistoryCategoryService);
    });

    describe('selectList()', () => {
        it('가계부 내역 카테고리 리스트 조회', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const response: AccountHistoryCategoryEntity[]
                = await accountHistoryCategoryController
                .selectAccountHistoryCategoryList(req, getAccountHistoryCategorySelectQueryDto(0));

            expect(response.every(v => v instanceof AccountHistoryCategoryEntity)).toBeTruthy();
        });
    });

    describe('createAccountHistoryCategory()', () => {
        it('가계부 내역 카테고리 등록', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const createAccountHistoryCategoryDto: CreateAccountHistoryCategoryDto = getCreateAccountHistoryCategoryData();

            const response: AccountHistoryCategoryEntity = await accountHistoryCategoryController
                .createAccountHistoryCategory(req, createAccountHistoryCategoryDto);

            expect(response instanceof AccountHistoryCategoryEntity).toBeTruthy();

            createdAccountHistoryCategoryInfo = response;
        });
    });

    describe('updateAccountHistoryCategory()', () => {
        it('가계부 내역 카테고리 수정', async () => {
            const updateAccountHistoryCategoryDto: UpdateAccountHistoryCategoryDto = {
                name: "용돈",
                type: 1,
                color: "333333"
            };
            const req: Request = createRequest();

            req.locals = {
                accountHistoryCategoryInfo: createdAccountHistoryCategoryInfo
            };

            const response: ResponseBooleanType
                = await accountHistoryCategoryController.updateAccountHistoryCategory(req, updateAccountHistoryCategoryDto);

            expect(response.result).toBeTruthy();
        });
    });

    describe('deleteAccountHistoryCategory()', () => {
        it('가계부 내역 카테고리 삭제', async () => {
            const req: Request = createRequest();

            req.locals = {
                accountHistoryCategoryInfo: createdAccountHistoryCategoryInfo
            };

            const response: ResponseBooleanType
                = await accountHistoryCategoryController.deleteAccountHistoryCategory(req);

            expect(response.result).toBeTruthy();
        });
    });


});
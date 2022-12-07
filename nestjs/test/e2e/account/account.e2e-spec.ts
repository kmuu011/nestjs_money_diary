import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../../../dist/src/app.module";
import {
    getSavedMember,
} from "../../modules/member/member";
import {MemberEntity} from "../../../src/modules/member/entities/member.entity";
import {getCreateAccountData} from "../../modules/account/account";
import {AccountEntity} from "../../../src/modules/account/entities/account.entity";

describe('AccountController (e2e)', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    let createdAccountInfo: AccountEntity;
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/account', () => {
        it('/ (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/account?page=1&count=10')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            const { items, count, totalCount, last } = response.body;

            expect(items !== undefined).toBeTruthy();
            expect(count !== undefined).toBeTruthy();
            expect(totalCount !== undefined).toBeTruthy();
            expect(last !== undefined).toBeTruthy();
        });

        it('/monthCostSummary (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/account/monthCostSummary?' +
                    'year=2022&month=12&startDate=20221127&endDate=20221231')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            const {
                accountHistoryDailyCostSummary,
                accountHistoryMonthCostSummary
            } = response.body;

            expect(accountHistoryDailyCostSummary !== undefined).toBeTruthy()
            expect(accountHistoryMonthCostSummary !== undefined).toBeTruthy()
        });

        it('/ (POST)', async () => {
            const response = await request(app.getHttpServer())
                .post('/account')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send(
                    getCreateAccountData()
                )
                .expect(201);

            createdAccountInfo = response.body;
        });
    });

    describe('/account/:accountIdx', () => {
        it('/ (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/account/' + createdAccountInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            const resultAccount: AccountEntity = response.body;

            expect(resultAccount.idx === createdAccountInfo.idx).toBeTruthy();
            expect(resultAccount.accountName === createdAccountInfo.accountName).toBeTruthy();
            expect(resultAccount.order === createdAccountInfo.order).toBeTruthy();
        });

        it('/ (PATCH)', async () => {
            const response = await request(app.getHttpServer())
                .patch('/account/' + createdAccountInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send({
                    accountName: '수정된 할일 그룹 제목',
                    order: 3,
                    invisibleAmount: 1
                })
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

        it('/ (DELETE)', async () => {
            const response = await request(app.getHttpServer())
                .delete('/account/' + createdAccountInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

    });

});

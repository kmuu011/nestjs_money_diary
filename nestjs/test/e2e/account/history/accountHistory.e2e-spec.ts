import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {MemberEntity} from "../../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../../../modules/member/member";
import {AppModule} from "../../../../dist/src/app.module";
import {AccountEntity} from "../../../../src/modules/account/entities/account.entity";
import {getSavedAccount} from "../../../modules/account/account";
import {AccountHistoryEntity} from "../../../../src/modules/account/history/entities/accountHistory.entity";
import {savedAccountHistoryCategoryData} from "../../../modules/account/history/category/accountHistoryCategory";

describe('AccountHistoryController (e2e)', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const savedAccountInfo: AccountEntity = getSavedAccount();
    let createdAccountHistoryInfo: AccountHistoryEntity;
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

    describe('/account/:accountIdx/history', () => {
        it('/ (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/account/'+ savedAccountInfo.idx
                    +'/history?page=1&count=10')
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

        it('/ (POST)', async () => {
            const response = await request(app.getHttpServer())
                .post('/account/'+ savedAccountInfo.idx + '/history')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send({
                    content: '순대국밥',
                    amount: 20000,
                    type: 0,
                    accountHistoryCategoryIdx: savedAccountHistoryCategoryData.idx
                })
                .expect(201);

            createdAccountHistoryInfo = response.body;
        });
    });

    describe('/account/:accountIdx/history/:accountHistoryIdx', () => {
        it('/ (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/account/'+ savedAccountInfo.idx
                    + '/history/' + createdAccountHistoryInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            expect(response !== undefined).toBeTruthy();
        });

        it('/ (PATCH)', async () => {
            const response = await request(app.getHttpServer())
                .patch('/account/'+ savedAccountInfo.idx
                    + '/history/' + createdAccountHistoryInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send({
                    content: '수정된 가계부 내역',
                    amount: 10000,
                    type: 0,
                    accountHistoryCategoryIdx: savedAccountHistoryCategoryData.idx
                })
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

        it('/ (DELETE)', async () => {
            const response = await request(app.getHttpServer())
                .delete('/account/'+ savedAccountInfo.idx
                    + '/history/' + createdAccountHistoryInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });
    });


});

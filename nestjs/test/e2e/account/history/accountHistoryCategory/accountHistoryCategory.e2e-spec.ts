import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {MemberEntity} from "../../../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../../../../modules/member/member";
import {
    AccountHistoryCategoryEntity
} from "../../../../../src/modules/account/history/category/entities/accountHistoryCategory.entity";
import {AppModule} from "../../../../../src/app.module";

describe('AccountHistoryCategoryController (e2e)', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    let createdAccountHistoryCategoryInfo: AccountHistoryCategoryEntity;
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

    describe('/account/history/category', () => {
        it('/ (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/account/history/category?type=0')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            const categoryList = response.body;

            expect(categoryList.constructor === Array).toBeTruthy();
        });

        it('/ (POST)', async () => {
            const response = await request(app.getHttpServer())
                .post('/account/history/category')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send({
                    name: '식비',
                    type: 0
                })
                .expect(201);

            createdAccountHistoryCategoryInfo = response.body;
        });
    });

    describe('/account/history/category', () => {
        it('/ (PATCH)', async () => {
            const response = await request(app.getHttpServer())
                .patch('/account/history/category/' + createdAccountHistoryCategoryInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send({
                    name: '용돈',
                    type: 1,
                    color: '555555'
                })
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

        it('/ (DELETE)', async () => {
            const response = await request(app.getHttpServer())
                .delete('/account/history/category/' + createdAccountHistoryCategoryInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });
    });

});

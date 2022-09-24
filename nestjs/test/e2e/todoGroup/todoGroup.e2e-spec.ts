import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../../../dist/src/app.module";
import {
    getSavedMember,
} from "../../modules/member/member";
import {Member} from "../../../src/modules/member/entities/member.entity";
import {getCreateTodoGroupData} from "../../modules/todoGroup/todoGroup";
import {TodoGroup} from "../../../src/modules/todoGroup/entities/todoGroup.entity";

describe('TodoGroupController (e2e)', () => {
    const savedMemberInfo: Member = getSavedMember();
    let createdTodoGroupInfo: TodoGroup;
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

    describe('/todoGroup', () => {
        it('/ (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/todoGroup?page=1&count=10')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            const { items, page, count, totalCount, last } = response.body;

            expect(items !== undefined).toBeTruthy();
            expect(page !== undefined).toBeTruthy();
            expect(count !== undefined).toBeTruthy();
            expect(totalCount !== undefined).toBeTruthy();
            expect(last !== undefined).toBeTruthy();
        });

        it('/ (POST)', async () => {
            const response = await request(app.getHttpServer())
                .post('/todoGroup')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send(
                    getCreateTodoGroupData()
                )
                .expect(201);

            createdTodoGroupInfo = response.body;
        });
    });

    describe('/todoGroup/:todoGroupIdx', () => {
        it('/ (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/todoGroup/' + createdTodoGroupInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            const resultTodoGroup: TodoGroup = response.body;

            expect(resultTodoGroup.idx === createdTodoGroupInfo.idx).toBeTruthy();
            expect(resultTodoGroup.title === createdTodoGroupInfo.title).toBeTruthy();
            expect(resultTodoGroup.order === createdTodoGroupInfo.order).toBeTruthy();
        });

        it('/ (PATCH)', async () => {
            const response = await request(app.getHttpServer())
                .patch('/todoGroup/' + createdTodoGroupInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send({
                    title: '수정된 할일 그룹 제목',
                    order: 3
                })
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

        it('/ (DELETE)', async () => {
            const response = await request(app.getHttpServer())
                .delete('/todoGroup/' + createdTodoGroupInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

    });

});

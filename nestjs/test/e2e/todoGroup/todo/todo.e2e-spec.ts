import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {Member} from "../../../../src/modules/member/entities/member.entity";
import {getSavedMember} from "../../../modules/member/member";
import {TodoGroup} from "../../../../src/modules/todoGroup/entities/todoGroup.entity";
import {AppModule} from "../../../../dist/src/app.module";
import {getSavedTodoGroup} from "../../../modules/todoGroup/todoGroup";
import {Todo} from "../../../../src/modules/todoGroup/todo/entities/todo.entity";

describe('TodoGroupController (e2e)', () => {
    const savedMemberInfo: Member = getSavedMember();
    const savedTodoGroupInfo: TodoGroup = getSavedTodoGroup();
    let createdTodoInfo: Todo;
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

    describe('/todo', () => {
        it('/ (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/todoGroup/'+ savedTodoGroupInfo.idx
                    +'/todo?page=1&count=10')
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
                .post('/todoGroup/'+ savedTodoGroupInfo.idx + '/todo')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send({
                    content: '할일 1'
                })
                .expect(201);

            createdTodoInfo = response.body;
        });
    });

    describe('/todo/:todoIdx', () => {
        it('/ (PATCH)', async () => {
            const response = await request(app.getHttpServer())
                .patch('/todoGroup/'+ savedTodoGroupInfo.idx
                    + '/todo/' + createdTodoInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .send({
                    content: '수정된 할일',
                    complete: false
                })
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

        it('/ (DELETE)', async () => {
            const response = await request(app.getHttpServer())
                .delete('/todoGroup/'+ savedTodoGroupInfo.idx
                    + '/todo/' + createdTodoInfo.idx)
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', savedMemberInfo.tokenInfo.code)
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });
    });


});

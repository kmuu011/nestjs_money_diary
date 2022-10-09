import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../../../dist/src/app.module";
import {
    getCreateMemberData,
    getProfileImagePath,
    getSavedMember,
} from "../../modules/member/member";
import {MemberEntity} from "../../../src/modules/member/entities/member.entity";
import {UpdateMemberDto} from "../../../src/modules/member/dto/update-member.dto";
import {json} from "express";

describe('MemberController (e2e)', () => {
    const savedMemberInfo: MemberEntity = getSavedMember();
    const createMemberInfo: MemberEntity = getCreateMemberData(false);
    let createMemberTokenCode: string;
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.use(json({ limit: '20mb' }));

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/member', () => {
        it('/signUp (POST)', async () => {
            const response = await request(app.getHttpServer())
                .post('/member/signUp')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .send(createMemberInfo)
                .expect(201);

            expect(response.body.result).toBeTruthy();

        });

        it('/login (POST)', async () => {
            const response = await request(app.getHttpServer())
                .post('/member/login')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .send({
                    id: createMemberInfo.id,
                    password: createMemberInfo.password,
                    keepCheck: false
                })
                .expect(200);

            createMemberTokenCode = response.body.tokenCode;
        });

        it('/auth (POST)', async () => {
            const response = await request(app.getHttpServer())
                .post('/member/auth')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', createMemberTokenCode)
                .expect(200);

            expect(response.body.id).toBe(createMemberInfo.id);
        });

        it('/ (Patch)', async () => {
            const updateMemberDto: UpdateMemberDto = {
                nickname: 'updated',
                email: 'updated@email.com',
                password: 'updated',
                originalPassword: createMemberInfo.password
            };

            const response = await request(app.getHttpServer())
                .patch('/member')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', createMemberTokenCode)
                .send(updateMemberDto)
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

        describe('/duplicateCheck (GET)', () => {
            it('id', async () => {
                const dupCheckFalseResponse
                    = await request(app.getHttpServer())
                    .get('/member/duplicateCheck?type=0&value=' +savedMemberInfo.id)
                    .expect(200);

                expect(dupCheckFalseResponse.body.result).toBeFalsy();

                const dupCheckTrueResponse
                    = await request(app.getHttpServer())
                    .get('/member/duplicateCheck?type=0&value=randomString')
                    .expect(200);

                expect(dupCheckTrueResponse.body.result).toBeTruthy();
            });

            it('nickname', async () => {
                const dupCheckFalseResponse
                    = await request(app.getHttpServer())
                    .get('/member/duplicateCheck?type=1&value=' + savedMemberInfo.nickname)
                    .expect(200);

                expect(dupCheckFalseResponse.body.result).toBeFalsy();

                const dupCheckTrueResponse
                    = await request(app.getHttpServer())
                    .get('/member/duplicateCheck?type=1&value=randomString')
                    .expect(200);

                expect(dupCheckTrueResponse.body.result).toBeTruthy();
            });

            it('email', async () => {
                const dupCheckFalseResponse
                    = await request(app.getHttpServer())
                    .get('/member/duplicateCheck?type=2&value=' + savedMemberInfo.email)
                    .expect(200);

                expect(dupCheckFalseResponse.body.result).toBeFalsy();

                const dupCheckTrueResponse
                    = await request(app.getHttpServer())
                    .get('/member/duplicateCheck?type=2&value=randomSting')
                    .expect(200);

                expect(dupCheckTrueResponse.body.result).toBeTruthy();
            });
        });

        it('/img (Patch)', async () => {
            const response = await request(app.getHttpServer())
                .patch('/member/img')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', createMemberTokenCode)
                .attach('file', getProfileImagePath())
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

        it('/img (Delete)', async () => {
            const response = await request(app.getHttpServer())
                .delete('/member/img')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', createMemberTokenCode)
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });

        it('/signOut (Delete)', async () => {
            const response = await request(app.getHttpServer())
                .delete('/member/signOut')
                .set('ip', '127.0.0.1')
                .set('user-agent', 'test-agent')
                .set('token-code', createMemberTokenCode)
                .expect(200);

            expect(response.body.result).toBeTruthy();
        });
    });
});

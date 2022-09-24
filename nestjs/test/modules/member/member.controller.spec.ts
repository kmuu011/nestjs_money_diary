import {Member} from "../../../src/modules/member/entities/member.entity";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../config/config";
import {
    getCreateMemberData, getLoginMemberDto, getProfileImageData, getSavedMember, getUpdateMemberDto,
    loginHeader,
} from "./member";
import {MemberRepository} from "../../../src/modules/member/member.repository";
import {TokenRepository} from "../../../src/modules/member/token/token.repository";
import {TodoGroupRepository} from "../../../src/modules/todoGroup/todoGroup.repository";
import {LoginMemberDto} from "../../../src/modules/member/dto/login-member.dto";
import {MemberController} from "../../../src/modules/member/member.controller";
import {MemberService} from "../../../src/modules/member/member.service";

import {createRequest} from "node-mocks-http";
import {Request} from "express";
import {FileType, LoginResponseType, ResponseBooleanType} from "../../../src/common/type/type";
import {CreateMemberDto} from "../../../src/modules/member/dto/create-member-dto";
import {UpdateMemberDto} from "../../../src/modules/member/dto/update-member.dto";
import {createRandomString} from "../../../libs/utils";
import {DuplicateCheckMemberDto} from "../../../src/modules/member/dto/duplicate-check-member.dto";

describe('Member Controller', () => {
    let memberController: MemberController;
    let memberService: MemberService;
    const savedMemberInfo: Member = getSavedMember();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    MemberRepository,
                    TokenRepository,
                    TodoGroupRepository
                ])
            ],
            controllers: [MemberController],
            providers: [
                MemberService
            ]
        }).compile();

        memberController = module.get<MemberController>(MemberController);
        memberService = module.get<MemberService>(MemberService);
    });

    describe('login()', () => {
        it('로그인', async () => {
            const req: Request = createRequest();

            req.headers = loginHeader;

            const loginMemberDto: LoginMemberDto = getLoginMemberDto();

            const loginResponseType: LoginResponseType = await memberController.login(req, loginMemberDto);

            expect(loginResponseType.tokenCode !== undefined).toBeTruthy();
        });
    });

    describe('signUp()', () => {
        it('회원가입', async () => {
            const createMemberDto: CreateMemberDto = getCreateMemberData(false);

            const signUpResponse: ResponseBooleanType = await memberController.signUp(createMemberDto);

            expect(signUpResponse.result).toBeTruthy();
        });
    });

    describe('updateMember()', () => {
        it('멤버 수정', async () => {
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const updateMemberDto: UpdateMemberDto = getUpdateMemberDto();

            const updateResponse: ResponseBooleanType = await memberController.updateMember(req, updateMemberDto);

            expect(updateResponse.result).toBeTruthy();
        });
    });

    describe('duplicateCheck()', () => {
        it('중복 체크', async () => {
            const checkKeyList = ['id', 'nickname', 'email'];

            const randomString = createRandomString(12);

            for(let i=0 ; i<checkKeyList.length ; i++){
                let duplicateCheckDto: DuplicateCheckMemberDto
                    = {type: i, value: savedMemberInfo[checkKeyList[i]]}

                const dupCheckFalse: ResponseBooleanType
                    = await memberController.duplicateCheck(duplicateCheckDto);

                expect(!dupCheckFalse.result).toBeTruthy();

                duplicateCheckDto = {type: i, value: randomString};

                const dupCheckTrue: ResponseBooleanType
                    = await memberController.duplicateCheck(duplicateCheckDto);

                expect(!dupCheckTrue.result).toBeFalsy();
            }
        });
    });

    describe('signOut()', () => {
        it('회원 탈퇴', async () => {
            const createMemberDto: Member = getCreateMemberData(false);

            const req: Request = createRequest();
            const member: Member = new Member();
            member.idx = createMemberDto.idx;

            req.locals = {
                memberInfo: member
            };

            const signOutResponse: ResponseBooleanType = await memberController.signOut(req);

            expect(signOutResponse.result).toBeTruthy();
        });
    });

    describe('updateImg()', () => {
        it('프로필 사진 수정', async () => {
            const imgData: FileType = getProfileImageData();
            const req: Request = createRequest();

            req.locals = {
                memberInfo: savedMemberInfo
            };

            const file = {
                fieldname: 'file',
                originalname: imgData.fileName + '.' + imgData.fileType,
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: imgData.fileBuffer,
                size: imgData.fileSize
            }

            const updateImgResponse: ResponseBooleanType = await memberController.updateImg(req, file);

            expect(updateImgResponse.result).toBeTruthy();
        });
    });

    describe('deleteImg()', () => {
        it('프로필 사진 삭제', async () => {
            const req: Request = createRequest();

            const savedMember: Member = await memberService.select(savedMemberInfo)

            req.locals = {
                memberInfo: savedMember
            };

            const deleteImgResponse: ResponseBooleanType = await memberController.deleteImg(req);

            expect(deleteImgResponse.result).toBeTruthy();
        });
    });

});
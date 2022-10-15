import {TokenRepository} from "../../../../src/modules/member/token/token.repository";
import {MemberEntity} from "../../../../src/modules/member/entities/member.entity";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../../config/config";
import {TokenEntity} from "../../../../src/modules/member/token/entities/token.entity";
import {getSavedMember} from "../member";
import {savedTokenInfo} from "./token";

describe('Token Repository', () => {
    let tokenRepository: TokenRepository;
    const savedMemberInfo: MemberEntity = getSavedMember();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                ])
            ],
            providers: [
                TokenRepository
            ]
        }).compile();

        tokenRepository = module.get<TokenRepository>(TokenRepository);
    });

    describe('select()', () => {
        it('토근 조회 기능', async () => {
            const token: TokenEntity = await tokenRepository.select(undefined, savedMemberInfo);

            if(!token){
                expect(token).toBe(undefined);
            }else{
                expect(token instanceof TokenEntity).toBe(true);
            }
        });
    });

    describe('saveToken()', () => {
        it('토큰 저장 기능', async () => {
            const token: TokenEntity = (await tokenRepository.select(undefined, savedMemberInfo)) ?? new TokenEntity();

            token.dataMigration({ ...savedTokenInfo, member: savedMemberInfo });

            const result: TokenEntity = await tokenRepository.saveToken(token);

            expect(result instanceof TokenEntity).toBe(true);
        });
    });

});
import {TokenRepository} from "../../../../src/modules/member/token/token.repository";
import {Member} from "../../../../src/modules/member/entities/member.entity";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmOptions} from "../../../../config/config";
import {Token} from "../../../../src/modules/member/entities/token.entity";
import {getSavedMember} from "../member";
import {savedTokenInfo} from "./token";

describe('Token Repository', () => {
    let tokenRepository: TokenRepository;
    const savedMemberInfo: Member = getSavedMember();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(typeOrmOptions),
                TypeOrmModule.forFeature([
                    TokenRepository,
                ])
            ],
            providers: [
                TokenRepository,
                {
                    provide: getRepositoryToken(Token),
                    useValue: TokenRepository
                }
            ]
        }).compile();

        tokenRepository = module.get<TokenRepository>(TokenRepository);
    });

    describe('select()', () => {
        it('토근 조회 기능', async () => {
            const token: Token = await tokenRepository.select(undefined, savedMemberInfo);

            if(!token){
                expect(token).toBe(undefined);
            }else{
                expect(token instanceof Token).toBe(true);
            }
        });
    });

    describe('saveToken()', () => {
        it('토큰 저장 기능', async () => {
            const token: Token = (await tokenRepository.select(undefined, savedMemberInfo)) ?? new Token();

            token.dataMigration({ ...savedTokenInfo, member: savedMemberInfo });

            const result: Token = await tokenRepository.saveToken(token);

            expect(result instanceof Token).toBe(true);
        });
    });

});
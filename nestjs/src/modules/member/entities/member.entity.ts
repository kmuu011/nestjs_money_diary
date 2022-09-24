import {IsBoolean, IsEmail, IsNumber, IsString, Length, NotContains} from "class-validator";
import {Token} from "./token.entity";

import {
    BaseEntity,
    Column, CreateDateColumn,
    Entity, OneToMany, OneToOne,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import {JwtPayload} from "jsonwebtoken";
import {createToken, decodeToken, encryptPassword} from "../../../../libs/member";
import {TodoGroup} from "../../todoGroup/entities/todoGroup.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'member'})
export class Member extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    @Column({primary: true, type: "int", unique: true, unsigned: true})
    @ApiProperty({
        example: '3'
    })
    idx: number = undefined;

    @NotContains('어드민')
    @NotContains('admin')
    @NotContains('테스트')
    @NotContains('test')
    @NotContains('관리자')
    @Length(3, 15)
    @IsString()
    @Column({type: 'varchar', length: 20, unique: true, comment: '유저 아이디'})
    @ApiProperty({
        example: 'tts'
    })
    id: string = undefined;

    @IsString()
    @Column({type: 'varchar', length: 200, comment: '유저 비밀번호'})
    @ApiProperty({
        example: 'tts0000'
    })
    password: string = undefined;

    @IsBoolean()
    passwordEncrypted: boolean = undefined;

    @NotContains('어드민')
    @NotContains('admin')
    @NotContains('테스트')
    @NotContains('test')
    @NotContains('관리자')
    @Length(2, 20)
    @IsString()
    @Column({type: 'varchar', length: 20, comment: '유저 닉네임'})
    @ApiProperty({
        example: 'tts'
    })
    nickname: string = undefined;

    @NotContains('어드민')
    @NotContains('admin')
    @NotContains('테스트')
    @NotContains('test')
    @NotContains('관리자')
    @IsEmail()
    @Column({type: 'varchar', length: 150, unique: true, comment: '유저 이메일'})
    @ApiProperty({
        example: 'tts@email.com'
    })
    email: string = undefined;

    @IsString()
    @Column({type: 'varchar', length: 200, nullable: true, comment: '유저 프로필 이미지 키'})
    @ApiProperty({
        example: 'profileImgs/50uykzhuk5d0hf79_1661698886122.jpg'
    })
    profileImgKey: string = undefined;

    @IsNumber()
    @Column({type: 'tinyint', default: 0, unsigned: true, comment: '관리자 유무'})
    admin: number = undefined;

    @CreateDateColumn()
    @Column({type: 'datetime', default: () => "now", comment: '회원가입 일자'})
    createdAt: string = undefined;

    @UpdateDateColumn()
    @Column({type: 'datetime', default: () => "now", comment: '수정 일자'})
    updatedAt: string = undefined;

    @IsNumber()
    @Column({type: 'tinyint', default: 0, comment: '가입 유형'})
    @ApiProperty({
        example: '0'
    })
    authType: number = undefined;

    @IsString()
    @Column({type: 'varchar', length: 100, nullable: true, comment: '소셜 가입 유니크 키'})
    @ApiProperty({
        example: '394711'
    })
    authId: string = undefined;

    @IsString()
    @Column({type: 'varchar', length: 30, nullable: true, comment: '접속 IP'})
    @ApiProperty({
        example: '127.0.0.1'
    })
    ip: string = undefined;

    @IsString()
    @Column({type: 'varchar', length: 400, nullable: true, comment: '접속 환경'})
    @ApiProperty({
        example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
    })
    userAgent: string = undefined;

    @IsBoolean()
    @ApiProperty({
        example: false
    })
    keepCheck: boolean = undefined;

    @OneToOne(() => Token, token => token.member)
    @ApiProperty()
    tokenInfo: Token;

    @OneToMany(() => TodoGroup, todoGroup => todoGroup.member)
    todoGroupList: TodoGroup[];

    passwordEncrypt(): void {
        if (this.passwordEncrypted !== true) {
            this.password = encryptPassword(this.password)
            this.passwordEncrypted = true;
        }
    }

    getPayload(): object {
        return {
            idx: this.idx,
            id: this.id,
            nickname: this.nickname,
            ip: this.ip,
            userAgent: this.userAgent,
            keepCheck: this.keepCheck,
            createdAt: this.createdAt,
            time: Date.now()
        }
    }

    createToken(): string {
        return createToken(this.getPayload());
    }

    async decodeToken(): Promise<JwtPayload> {
        return decodeToken(this.tokenInfo.token);
    }

    dataMigration(object: object) : void {
        for (let k in new Member()) {
            if (object[k] === undefined) continue;
            this[k] = object[k];
        }
    }
}
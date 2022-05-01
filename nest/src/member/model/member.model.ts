import {IsBoolean, IsEmail, IsNumber, IsString, Length, NotContains} from "class-validator";
import config from "config/config";
import cipher from "libs/cipher";
import {Message} from "libs/message";

const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const expireTime = config.member.expireTime;
const jwtSecret = config.member.jwtSecret;

export class Member {
    @IsNumber()
    idx: number = undefined;

    @Length(3, 15)
    @NotContains('어드민')
    @NotContains('admin')
    @NotContains('테스트')
    @NotContains('test')
    @NotContains('관리자')
    @IsString()
    id: string = undefined;

    @IsString()
    password: string = undefined;

    @IsBoolean()
    password_encrypted: boolean = undefined;

    @Length(2, 20)
    @IsString()
    @NotContains('어드민')
    @NotContains('admin')
    @NotContains('테스트')
    @NotContains('test')
    @NotContains('관리자')
    nickname: string = undefined;

    @NotContains('어드민')
    @NotContains('admin')
    @NotContains('테스트')
    @NotContains('test')
    @NotContains('관리자')
    @IsEmail()
    email: string = undefined;

    @IsString()
    profile_img_key: string = undefined;

    @IsNumber()
    admin: number = undefined;
    @IsNumber()
    created_at: number = undefined;
    @IsNumber()
    updated_at: number = undefined;
    @IsNumber()
    auth_type: number = undefined;

    @IsString()
    auth_id: string = undefined;

    @IsString()
    ip: string | string[] = undefined;

    @IsString()
    user_agent: string = undefined;

    @IsNumber()
    max_sale_keyword_cnt: number = undefined;

    @IsNumber()
    mailing_test_at: number = undefined;

    @IsString()
    token: string = undefined;

    @IsBoolean()
    keep_check: boolean = undefined;

    passwordEncrypt(): void{
        if(this.password_encrypted !== true) {
            this.password = crypto
                .createHash(config.member.hashAlgorithm)
                .update(this.password + config.member.salt)
                .digest('hex');
        }
    }

    getPayload(): object{
        return {
            idx: this.idx,
            id: this.id,
            nickname: this.nickname,
            ip: this.ip,
            user_agent: this.user_agent,
            keep_check: this.keep_check,
            created_at: this.created_at,
            time: Date.now()
        }
    }

    createToken(): void {
        const payloadObj = this.getPayload();

        const token = jwt.sign(payloadObj, jwtSecret, {expiresIn: expireTime});

        this.token = cipher.encrypt(token);
    }

    async decodeToken(): Promise<void> {
        const authorization = await new Promise(async (resolve) => {
            const token = cipher.decrypt(this.token);
            if(token === undefined) resolve(undefined);

            jwt.verify(token, jwtSecret, (err, decoded) => {
                if(err){
                    resolve(undefined);
                }
                resolve(decoded);
            });
        });

        if(authorization === undefined){
            throw Message.UNAUTHORIZED;
        }

        this.dataMigration(authorization);
    }

    dataMigration(object): void {
        for(let k in new Member()){
            if(object[k] === undefined) continue;
            this[k] = object[k];
        }
    }
}
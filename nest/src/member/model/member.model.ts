import {IsBoolean, IsEmail, IsNumber, IsString, Length, NotContains} from "class-validator";
import config from "config/config";
import cipher from "libs/cipher";

const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const expireTime = config.member.expireTime;
const jwtSecret = config.member.jwtSecret;

export class Member {
    @IsNumber()
    idx: number;

    @Length(3, 15)
    @NotContains('어드민')
    @NotContains('admin')
    @NotContains('테스트')
    @NotContains('test')
    @NotContains('관리자')
    @IsString()
    id: string;

    @IsString()
    password: string;

    @IsBoolean()
    password_encrypted: boolean

    @Length(2, 20)
    @IsString()
    @NotContains('어드민')
    @NotContains('admin')
    @NotContains('테스트')
    @NotContains('test')
    @NotContains('관리자')
    nickname: string;

    @NotContains('어드민')
    @NotContains('admin')
    @NotContains('테스트')
    @NotContains('test')
    @NotContains('관리자')
    @IsEmail()
    email: string;

    @IsString()
    profile_img_key: string;

    @IsNumber()
    admin: number;
    @IsNumber()
    created_at: number;
    @IsNumber()
    updated_at: number;
    @IsNumber()
    auth_type: number;

    @IsString()
    auth_id: string;

    @IsString()
    ip: string | string[];

    @IsString()
    user_agent: string;

    @IsNumber()
    max_sale_keyword_cnt: number;

    @IsNumber()
    mailing_test_at: number;

    @IsString()
    token: string;

    @IsBoolean()
    keep_check: boolean;

    passwordEncrypt(){
        if(this.password_encrypted !== true) {
            this.password = crypto
                .createHash(config.member.hashAlgorithm)
                .update(this.password + config.member.salt)
                .digest('hex');
        }
    }

    getPayload(){
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

    createToken() {
        const payloadObj = this.getPayload();

        const token = jwt.sign(payloadObj, jwtSecret, {expiresIn: expireTime});

        this.token = cipher.encrypt(token);
    }

    dataMigration(object) {
        for(let k in object){
            this[k] = object[k];
        }
    }
}
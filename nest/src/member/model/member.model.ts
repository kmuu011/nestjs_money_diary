import config from "config/config";
import cipher from "libs/cipher";

const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const expireTime = config.member.expireTime;
const jwtSecret = config.member.jwtSecret;

export class Member {
    idx: number;
    id: string;
    password: string;
    password_encrypted: boolean;
    nickname: string;
    email: string;
    profile_img_key: string;
    admin: number;
    created_at: number;
    updated_at: number;
    auth_type: number;
    auth_id: string;
    ip: string | string[];
    user_agent: string;
    max_sale_keyword_cnt: number;
    mailing_test_at: number;
    token: string;
    keep_check: boolean;

    async passwordEncrypt(){
        if(this.password_encrypted === true) return;

        this.password = crypto
            .createHash(config.member.hashAlgorithm)
            .update(this.password+config.member.salt)
            .digest('hex');

        this.password_encrypted = true;
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

    async createToken() {
        const payloadObj = this.getPayload();

        const token = jwt.sign(payloadObj, jwtSecret, {expiresIn: expireTime});

        this.token = await cipher.encrypt(token);
    }

    async dataMigration(object) {
        for(let k in object){
            this[k] = object[k];
        }
    }
}
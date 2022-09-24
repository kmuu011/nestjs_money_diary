import {auth, serverType} from "../config/config";
import {Message} from "./message";
import {JwtPayload} from "jsonwebtoken";

const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const expireTime = serverType === 'test' ? 60*60*24*365*100 : auth.expireTime;
const jwtSecret = auth.jwtSecret;

export const encryptPassword = (password: string): string => {
    return crypto
        .createHash(auth.hashAlgorithm)
        .update(password + auth.salt)
        .digest('hex');
}

export const createToken = (payloadObj): string => {
    return jwt.sign(payloadObj, jwtSecret, {expiresIn: expireTime});
}

export const decodeToken = async (token): Promise<JwtPayload> => {
    const jwtPayload = await new Promise(async (resolve) => {
        if (token === undefined) resolve(undefined);

        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                resolve(undefined);
            }
            resolve(decoded);
        })
    })

    if (jwtPayload === undefined) {
        throw Message.UNAUTHORIZED;
    }

    return jwtPayload;
}
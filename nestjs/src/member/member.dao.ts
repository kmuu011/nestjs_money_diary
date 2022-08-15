import {Injectable} from "@nestjs/common";
import {Request} from "express";

import {Member} from "./model/member.model";
import {Message} from "libs/message";

import DB from "libs/db";

const mysql = require('mysql2');

const duplicateCheckKeys = ['id', 'nickname', 'email'];

let sql: string;

@Injectable()
export class MemberDao {
    async login(member: Member): Promise<Member> {
        const { id, password } = member;

        sql = "SELECT idx, id, nickname, email, auth_id, " +
            "email, created_at*1000 created_at " +
            "FROM member WHERE id = ? AND password = ? ";
        sql = mysql.format(sql, [id, password]);

        const loginResult: Member[] = await DB.query(sql);

        if(loginResult.length === 0){
            throw Message.WRONG_ID_OR_PASSWORD;
        }

        if(loginResult[0].auth_id !== null){
            throw Message.CONNECTED_SNS;
        }

        return loginResult[0];
    }

    async signUp(req: Request, member: Member): Promise<void> {
        const { sqlCol, sqlVal } = req.organizedSql;

        sql = "INSERT " +
            "INTO member (" + sqlCol + ") " +
            "VALUES(" + sqlVal + ")";

        const signUpResult = await DB.run(req.connector, sql);

        if(signUpResult.affectedRows !== 1){
            throw Message.SERVER_ERROR;
        }

        member.idx = signUpResult.insertId;
    }

    async update(req: Request, member: Member) {
        const { sqlSet } = req.organizedSql;

        sql = "UPDATE member " +
            "SET " + sqlSet + " " +
            "WHERE idx = ? ";
        sql = mysql.format(sql, [ member.idx ]);

        const resultUpdateMember = await DB.run(req.connector, sql);

        if(resultUpdateMember.affectedRows !== 1){
            throw Message.SERVER_ERROR;
        }

        return resultUpdateMember;
    }

    async duplicateCheck(type: number, value: string) {
        sql = "SELECT idx " +
            "FROM member " +
            "WHERE  " + duplicateCheckKeys[type] + " = ? ";
        sql = mysql.format(sql, [ value ]);

        const memberInfo = await DB.query(sql);

        return {type, isDuplicate : memberInfo.length !== 0};
    }
}
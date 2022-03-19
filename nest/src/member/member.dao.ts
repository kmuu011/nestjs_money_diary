import {Injectable} from "@nestjs/common";
import {Request} from "express";

import {Member} from "./model/member.model";
import {Message} from "libs/message";
import {UpdateMemberDto} from "./dto/update-member.dto";

import DB from "libs/db";

const mysql = require('mysql2');

let sql: string;

@Injectable()
export class MemberDao {
    async login(member: Member): Promise<Member> {
        const { id, encrypted_password } = member;

        sql = "SELECT idx, id, nickname, email, auth_id, " +
            "email, created_at*1000 created_at " +
            "FROM member WHERE id = ? AND password = ? ";
        sql = mysql.format(sql, [id, encrypted_password]);

        const loginResult: Member[] = await DB.query(sql);

        if(loginResult.length === 0){
            throw Message.WRONG_ID_OR_PASSWORD;
        }

        if(loginResult[0].auth_id !== null){
            throw Message.CONNECTED_SNS;
        }

        return loginResult[0];
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
}
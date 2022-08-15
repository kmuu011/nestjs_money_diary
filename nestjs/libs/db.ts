import config from 'config/config';
import utils from "libs/utils";
import {PoolConnection, ResultSetHeader} from "mysql2";
import {Message} from "./message";

const mysql = require('mysql2');

const pool = mysql.createPool(config.mysqlConfig);
const poolAdmin = mysql.createPool(config.mysqlConfigAdmin);

const getConnection = async (connect): Promise<PoolConnection> => {
    try {
        return await new Promise(async (resolve, reject) => {
            connect.getConnection(function (err, connection: PoolConnection) {
                if (err) {
                    console.log('-------DB CONNECTION ERROR-------');
                    console.log(err);
                    reject();
                }

                resolve(connection);
            });
        })
    }catch (e){
        throw Message.SERVER_ERROR;
    }
};

const query = async (sql, connect): Promise<any> => {
    const connection: PoolConnection = await getConnection(connect);

    try {
        return await new Promise(async (resolve, reject) => {
            connection.query(sql, async function (err, rows) {
                if (err) {
                    console.log(err);
                    reject();
                }

                if (rows !== undefined && rows.constructor === Array) {
                    await utils.activeQuestionMark(rows);
                }

                resolve(rows);
            });
        });
    }catch (e){
        throw Message.SERVER_ERROR;
    }finally {
        connection.release();
    }
};

export default {
    getConnection: async (): Promise<PoolConnection> => {
        const connection: PoolConnection = await getConnection(pool);

        try {
            return await new Promise(async (resolve, reject) => {
                connection.beginTransaction(function (err) {
                    if (err) {
                        console.log('transaction err');
                        console.log(err);
                        reject();
                    }
                    resolve(connection);
                });
            })
        } catch (e) {
            throw Message.SERVER_ERROR;
        } finally {
            connection.release();
        }
    },

    run: async (connector, sql): Promise<ResultSetHeader> => {
        try {
            return await new Promise(async (resolve, reject) => {
                connector.query(sql, function (err, rows) {
                    if (err) {
                        console.log('----- SQL ERROR -----');
                        console.log(err);
                        reject();
                    }

                    resolve(rows);
                });
            });

        } catch (e) {
            throw Message.SERVER_ERROR;
        }
    },

    commit: async (connector): Promise<void> => {
        try {
            await new Promise(async (resolve, reject) => {
                connector.commit(function (err) {
                    if (err) {
                        console.log(err);
                        reject();
                    }

                    resolve(true);
                });
            })
        } catch (e) {
            throw Message.SERVER_ERROR;
        } finally {
            connector.release();
        }
    },

    rollback: async (connector): Promise<void> => {
        connector.rollback(() => {
            console.log('롤백 작동');
            connector.release();
        });
    },

    release: async (connector): Promise<void> => {
        connector.release();
    },

    query: async (sql): Promise<any> => {
        return await query(sql, pool);
    },

    adminQuery: async (sql): Promise<any> => {
        return await query(sql, poolAdmin);
    }
}
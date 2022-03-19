import config from 'config/config';
import utils from "libs/utils";
import {ResultSetHeader} from "mysql2";

const mysql = require('mysql2');

const pool = mysql.createPool(config.mysqlConfig);
const poolAdmin = mysql.createPool(config.mysqlConfigAdmin);

const query = async (sql, connect): Promise<any> => {
    return await new Promise(async (resolve, reject) => {
        connect.getConnection(function (err, connection) {
            if (err) {
                console.log('-------DB CONNECTION ERROR-------');
                throw err;
            }

            try {
                connection.query(sql, async function (err, rows) {
                    if (err) {
                        reject(err);
                    }else{
                        if(rows !== undefined && rows.constructor === Array){
                            await utils.activeQuestionMark(rows);
                        }
                    }

                    resolve(rows);
                })
            } catch (e) {
                throw e;

            } finally {
                connection.release();
            }

        });
    });
};

export default {
    getConnection: async (): Promise<void> => {
        try {
            return await new Promise(async (resolve, reject) => {
                pool.getConnection(function (err, connection) {
                    connection.beginTransaction(function (err) {
                        if (err) {
                            console.log('transaction err');
                            console.log(err);
                            reject('Error');
                        }
                        resolve(connection);
                    })
                });
            });
        } catch (e) {
            throw 'Error';
        }
    },

    run: async (connector, sql): Promise<ResultSetHeader> => {
        try {
            return await new Promise(async (resolve, reject) => {
                connector.query(sql, function (err, rows) {
                    if (err) {
                        console.log('----- SQL ERROR -----');
                        console.log(err);
                        reject('Error');
                    }

                    resolve(rows);
                });
            });

        } catch (e) {
            throw 'Error';
        }
    },

    commit: async (connector): Promise<void> => {
        try {
            await new Promise(async (resolve, reject) => {
                connector.commit(function (err) {
                    if (err) {
                        reject(err);
                    }

                    resolve(true);
                });
            })
        } catch (e) {
            throw 'Error';
        } finally {
            connector.release();
        }
    },

    rollback: async (connector): Promise<void> => {
        console.log('롤백 작동');
        try {
            await connector.rollback(function () {});
        } catch (e) {
        } finally {
            connector.release();
        }
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
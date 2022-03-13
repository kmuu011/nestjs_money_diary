import config from 'config/config';
import utils from "libs/utils";

const mysql = require('mysql');

const pool = mysql.createPool(config.mysql_config);
const pool_admin = mysql.createPool(config.mysql_config_admin);

const query = async (sql, connect) => {
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
    get_connection: async () => {
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

    run: async (connector, sql) => {
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

    commit: async (connector) => {
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

    rollback: async (connector) => {
        console.log('롤백 작동');
        try {
            await connector.rollback(function () {});
        } catch (e) {
        } finally {
            connector.release();
        }
    },

    release: async (connector) => {
        connector.release();
    },

    query: async (sql) => {
        return await query(sql, pool);
    },

    admin_query: async (sql) => {
        return await query(sql, pool_admin);
    }
}
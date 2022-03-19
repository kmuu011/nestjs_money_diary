const mysql = require('mysql2');

const timeAdditionalList = [
    {col: 'created_at', val: 'UNIX_TIMESTAMP()', set: 'created_at = UNIX_TIMESTAMP()'},
    {col: 'created_at, updated_at', val: 'UNIX_TIMESTAMP(),UNIX_TIMESTAMP()', set: 'created_at = UNIX_TIMESTAMP(), updated_at = UNIX_TIMESTAMP()'},
    {col: 'updated_at', val: 'UNIX_TIMESTAMP()', set: 'updated_at = UNIX_TIMESTAMP()'},
];

const sqlCreator = (data, key) => {
    let sqlCol: string = '';
    let sqlVal: string = '';
    let sqlSet: string = '';

    sqlCol += "`" + key + "`, ";

    sqlVal += "?, ";
    sqlVal = mysql.format(sqlVal, [ data ]);

    sqlSet += "`" + key + "` = ?, ";
    sqlSet = mysql.format(sqlSet, [ data ]);

    return { sqlCol, sqlVal, sqlSet };
};

export default {
    getSql: (
        dataObj: object,
        requireKeys: string | string[] | undefined,
        optionalKeys: string | string[] | undefined,
        timeAdditional: number | undefined
    ) => {
        let sqlCol: string = '';
        let sqlVal: string = '';
        let sqlSet: string = '';

        if(requireKeys !== undefined) {
            if(requireKeys.constructor !== String) {
                requireKeys = requireKeys.toString();
            }

            requireKeys = requireKeys.replace(/\s/g, '').split(',');

            for (let k of requireKeys) {
                const sqlPiece = sqlCreator(dataObj[k], k);

                sqlCol += sqlPiece.sqlCol;
                sqlVal += sqlPiece.sqlVal;
                sqlSet += sqlPiece.sqlSet;
            }
        }

        if(optionalKeys !== undefined){
            if(optionalKeys.constructor !== String) {
                optionalKeys = optionalKeys.toString();
            }

            optionalKeys = optionalKeys.replace(/\s/g, '').split(',');

            for(let k of optionalKeys){
                if(dataObj[k] === undefined) continue;

                const sqlPiece = sqlCreator(dataObj[k], k);

                sqlCol += sqlPiece.sqlCol;
                sqlVal += sqlPiece.sqlVal;
                sqlSet += sqlPiece.sqlSet;
            }
        }

        if(timeAdditional !== undefined){
            const timeAdditionalObj = timeAdditionalList[timeAdditional];

            sqlCol += timeAdditionalObj.col;
            sqlVal += timeAdditionalObj.val;
            sqlSet += timeAdditionalObj.set;
        }

        return { sqlCol, sqlVal, sqlSet };
    }
}
import {TokenEntity} from "../../../../src/modules/member/token/entities/token.entity";
import {swagger} from "../../../../config/config";

export const savedTokenInfo = {
    token: swagger.dummyUserInfo.token,
    code: swagger.dummyUserInfo.tokenCode
}

export const getTokenInfo = (where?) => {
    const token: TokenEntity = new TokenEntity();

    token.dataMigration(savedTokenInfo);

    if(where !== undefined){
        return undefined;
    }

    return token;
}

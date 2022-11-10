import {AccountHistoryEntity} from "../../../../src/modules/account/history/entities/accountHistory.entity";
import {getSavedAccount} from "../account";
import {getSavedAccountHistoryCategory} from "./category/accountHistoryCategory";
import {CreateAccountHistoryDto} from "../../../../src/modules/account/history/dto/create-accountHistory-dto";
import {SelectAccountHistoryDto} from "../../../../src/modules/account/history/dto/select-accountHistory-dto";

const savedCategoryInfo = getSavedAccountHistoryCategory();
const savedAccountInfo = getSavedAccount();

export const savedAccountHistoryData = {
    idx: 1,
    content: '테스트 가계부 내역 1',
    amount: "1000",
    type: 0,
    account: getSavedAccount(),
    accountHistoryCategory: savedCategoryInfo
};

export const getSavedAccountHistory = (): AccountHistoryEntity => {
    const savedAccountHistory: AccountHistoryEntity = new AccountHistoryEntity();
    savedAccountHistory.dataMigration(savedAccountHistoryData);

    return savedAccountHistory;
};

export const getCreateAccountHistoryEntity = (): AccountHistoryEntity => {
    const accountHistory = new AccountHistoryEntity();

    accountHistory.dataMigration({
        idx: 111,
        content: '테스트 가계부 내역 1',
        amount: 1000,
        account: savedAccountInfo,
        accountHistoryCategory: savedCategoryInfo,
        type: 0
    });

    return accountHistory;
}

export const getCreateAccountHistoryDto = (): CreateAccountHistoryDto => {
    return {
        content: '테스트 가계부 내역 1',
        amount: 1000,
        accountHistoryCategoryIdx: savedCategoryInfo.idx,
        type: 0,
        createdAt: undefined
    }
}

export const getSelectAccountHistoryDto = (): SelectAccountHistoryDto => {
    return {
        cursorIdx: 0,
        count: 10,
        type: 0,
        accountHistoryCategoryIdx: savedCategoryInfo.idx
    }
}
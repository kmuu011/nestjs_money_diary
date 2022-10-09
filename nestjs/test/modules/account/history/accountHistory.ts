import {AccountHistoryEntity} from "../../../../src/modules/account/history/entities/accountHistory.entity";
import {getSavedAccount} from "../account";

export const savedAccountHistoryData = {
    idx: 1,
    content: '테스트 가계부 내역 1',
    amount: "1000",
    type: 0
};

export const getSavedAccountHistory = (): AccountHistoryEntity => {
    const savedAccountHistory: AccountHistoryEntity = new AccountHistoryEntity();
    savedAccountHistory.dataMigration({
        ...savedAccountHistoryData,
        account: getSavedAccount()
    });

    return savedAccountHistory;
};

export const getCreateAccountHistoryData = (): AccountHistoryEntity => {
    const accountHistory = new AccountHistoryEntity();

    accountHistory.dataMigration({
        idx: 111,
        account: getSavedAccount(),
        content: '테스트 가계부 내역 1',
        amount: 1000,
        type: 0
    });

    return accountHistory;
}
import {
    AccountHistoryCategoryEntity
} from "../../../../../src/modules/account/history/category/entities/accountHistoryCategory.entity";
import {getSavedMember} from "../../../member/member";

export const savedAccountHistoryCategoryData = {
    idx: 1,
    default: 0,
    type: 0,
    color: 'f1f1f1',
    name: '식비',
    member: getSavedMember()
};

export const getSavedAccountHistoryCategory = (): AccountHistoryCategoryEntity => {
    const savedAccountHistoryCategory: AccountHistoryCategoryEntity = new AccountHistoryCategoryEntity();
    savedAccountHistoryCategory.dataMigration(savedAccountHistoryCategoryData);

    return savedAccountHistoryCategory;
};

export const getCreateAccountHistoryCategoryData = (idx?: number): AccountHistoryCategoryEntity => {
    const accountHistoryCategory = new AccountHistoryCategoryEntity();

    accountHistoryCategory.dataMigration({
        idx: idx || 111,
        member: getSavedMember(),
        default: 0,
        type: 0,
        color: 'f1f1f1',
        name: '테스트 카테고리'
    });

    return accountHistoryCategory;
}
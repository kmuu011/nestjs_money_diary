import {AccountEntity} from "../../../src/modules/account/entities/account.entity";
import {getSavedMember} from "../member/member";
import {dateToObject} from "../../../libs/utils";
import {SelectAccountMonthSummaryDto} from "../../../src/modules/account/dto/select-accountHistoryMonthSummary-dto";

const nowDateObj = dateToObject();
const endDateObj = dateToObject(new Date(Date.now() + 60 * 60 * 24 * 30 * 1000));

export const savedAccountData = {
    idx: 1,
    accountName: '제 1 가계부',
    totalAmount: 0,
    invisibleAmount: 0,
    order: 1,
    member: getSavedMember()
};

export const getSavedAccount = (): AccountEntity => {
    const savedAccount: AccountEntity = new AccountEntity();

    savedAccount.dataMigration(savedAccountData);

    return savedAccount;
}

export const getCreateAccountData = (): AccountEntity => {
    const account = new AccountEntity();

    account.dataMigration({
        idx: 13,
        member: getSavedMember(),
        accountName: '제 2 가계부'
    });

    return account;
}

export const monthSummaryDataKeyList = [
    {
        key: 'outcome',
        type: 'number',
    },
    {
        key: 'income',
        type: 'number'
    }
]

export const monthDailySummaryDataKeyList = [
    {
        key: 'date',
        type: 'string'
    },
    ...monthSummaryDataKeyList
];

export const accountMonthSummaryDto: SelectAccountMonthSummaryDto = {
    year: nowDateObj.year,
    month: nowDateObj.year,
    startDate: nowDateObj.year + nowDateObj.month + nowDateObj.date,
    endDate: endDateObj.year + endDateObj.month + endDateObj.date,
    multipleAccountIdx : savedAccountData.idx.toString(),
}
import {AccountEntity} from "../../../src/modules/account/entities/account.entity";
import {getSavedMember} from "../member/member";

export const savedAccountData = {
    idx: 1,
    title: '제 1 가계부',
    order: 1
};

export const getSavedAccount = (): AccountEntity => {
    const savedAccount: AccountEntity = new AccountEntity();

    savedAccount.dataMigration({
        ...savedAccountData,
        member: getSavedMember()
    });

    return savedAccount;
}

export const getCreateAccountData = (): AccountEntity => {
    const account = new AccountEntity();

    account.dataMigration({
        idx: 13,
        member: getSavedMember(),
        title: '제 2 가계부'
    });

    return account;
}
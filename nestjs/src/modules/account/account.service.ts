import {Injectable} from '@nestjs/common';
import {MemberEntity} from "../member/entities/member.entity";
import {DeleteResult, QueryRunner, UpdateResult} from "typeorm";
import {Message} from "../../../libs/message";
import {AccountIncomeOutcomeType} from "../../common/type/type";
import {InjectRepository} from "@nestjs/typeorm";
import {AccountRepository} from "./account.repository";
import {AccountEntity} from "./entities/account.entity";
import {UpdateAccountDto} from "./dto/update-account-dto";
import {CreateAccountDto} from "./dto/create-account-dto";
import {
    AccountCursorSelectListResponseType,
    AccountDailyCostSummaryType,
    AccountMonthSummaryResponseType, AccountMonthCostSummaryType, AccountCostSummaryByCategoryType
} from "./type/type";

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountRepository) private readonly accountRepository: AccountRepository,
    ) {
    }

    async accountListCheck(
        member: MemberEntity,
        multipleAccountIdx: string
    ): Promise<number[]> {
        let accountIdxList: number[];

        if (multipleAccountIdx && multipleAccountIdx !== '-1') {
            accountIdxList = multipleAccountIdx.split(',').map(v => Number(v));

            const accountInfoList: AccountEntity[] =
                await this.accountRepository.selectMultiple(member, accountIdxList);

            if (accountInfoList.length !== accountInfoList.length) {
                throw Message.WRONG_PARAM('multipleAccountIdx');
            }
        }

        return accountIdxList;
    }

    async arrangeOrder(member: MemberEntity, account?: AccountEntity, order?: number): Promise<void> {
        const accountList = (await this.accountRepository.selectList(member))[0];
        let splicedAccountList = [...accountList];

        if (account) {
            const newList = [];

            const splicedAccount = splicedAccountList
                .splice(splicedAccountList.findIndex(v => v.idx === account.idx), 1);

            if (order === 1) {
                splicedAccountList.unshift(splicedAccount[0]);
            } else if (order === accountList.length) {
                splicedAccountList.push(splicedAccount[0]);
            } else {
                for (let i = 0; i < splicedAccountList.length; i++) {
                    if (newList.length + 1 === order) {
                        newList.push(splicedAccount[0]);
                    }

                    newList.push(splicedAccountList[i]);
                }
                splicedAccountList = newList;
            }
        }

        for (let i = 0; i < splicedAccountList.length; i++) {
            splicedAccountList[i].order = i + 1;

            const updateResult: UpdateResult =
                await this.accountRepository
                    .updateAccount(undefined, splicedAccountList[i]);

            if (updateResult.affected !== 1) {
                throw Message.SERVER_ERROR;
            }
        }
    }

    async selectMonthCostSummary(
        member: MemberEntity,
        year: string,
        month: string,
        startDate: string,
        endDate: string,
        multipleAccountIdx?: string
    ): Promise<AccountMonthSummaryResponseType> {
        const accountIdxList: number[] = await this.accountListCheck(member, multipleAccountIdx);

        const accountHistoryDailyCostSummary: AccountDailyCostSummaryType[] =
            await this.accountRepository.selectMonthDailySummary(member, startDate, endDate, accountIdxList);

        accountHistoryDailyCostSummary.forEach((v) => {
            v.outcome = Number(v.outcome);
            v.income = Number(v.income);
        });

        const accountHistoryMonthCostSummary: AccountMonthCostSummaryType =
            await this.accountRepository.selectMonthCostSummary(member, year + month, accountIdxList);

        Object.keys(accountHistoryMonthCostSummary).forEach((k) => {
            const v = Number(accountHistoryMonthCostSummary[k]);
            accountHistoryMonthCostSummary[k] = isNaN(v) === true ? 0 : v;
        });

        return {
            accountHistoryDailyCostSummary,
            accountHistoryMonthCostSummary
        }
    }

    async selectCostSummaryByCategory(
        member: MemberEntity,
        type: number,
        year: string,
        month?: string,
        multipleAccountIdx?: string
    ): Promise<AccountCostSummaryByCategoryType[]> {
        const accountIdxList: number[] = await this.accountListCheck(member, multipleAccountIdx);

        return (await this.accountRepository
            .selectCostSummaryByCategory(
                member,
                type,
                year,
                month,
                accountIdxList
            )).map(v => {
            v.amount = Number(v.amount);
            return v
        });
    }

    async selectIncomeOutcome(queryRunner: QueryRunner, account: AccountEntity): Promise<AccountIncomeOutcomeType> {
        return await this.accountRepository.selectTotalIncomeOutcome(queryRunner, account.member, account.idx);
    }

    async resetTotalAmount(queryRunner: QueryRunner, account: AccountEntity): Promise<void> {
        const accountIncomeOutcome: AccountIncomeOutcomeType = await this.selectIncomeOutcome(queryRunner, account);
        account.totalAmount = accountIncomeOutcome.income - accountIncomeOutcome.outcome;

        const updateResult: UpdateResult = await this.accountRepository.updateAccount(queryRunner, account);

        if (updateResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }
    }

    async selectOne(member: MemberEntity, accountIdx: number): Promise<AccountEntity> {
        return await this.accountRepository.selectOne(member, accountIdx);
    }

    async selectList(
        member: MemberEntity,
        startCursor: number,
        endCursor: number,
        count?: number
    ): Promise<AccountCursorSelectListResponseType<AccountEntity>> {
        const result = await this.accountRepository.selectList(member, startCursor, endCursor, count);
        const totalAmount = await this.accountRepository.selectTotalAmount(member);

        return {
            items: result[0],
            startCursor,
            count,
            totalCount: result[1],
            last: Math.ceil(result[1] / count) || 1,
            totalAmount
        };
    }

    async create(member: MemberEntity, body: CreateAccountDto): Promise<AccountEntity> {
        const account: AccountEntity = new AccountEntity();
        account.dataMigration({
            ...body,
            ...{member}
        });

        account.order = (await this.accountRepository.selectList(member))[1] + 1;

        await this.arrangeOrder(member);

        return await this.accountRepository.createAccount(undefined, account);
    }

    async update(member: MemberEntity, account: AccountEntity, body: UpdateAccountDto): Promise<UpdateResult> {
        account.accountName = body.accountName;
        account.invisibleAmount = body.invisibleAmount;

        const updateResult: UpdateResult = await this.accountRepository.updateAccount(undefined, account);

        if (updateResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        if (account.order !== body.order && body.order !== undefined) {
            await this.arrangeOrder(member, account, body.order);
        }

        return updateResult;
    }

    async delete(member: MemberEntity, account: AccountEntity): Promise<DeleteResult> {
        const deleteResult: DeleteResult = await this.accountRepository.deleteAccount(account);

        if (deleteResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        await this.arrangeOrder(member);

        return deleteResult
    }

}

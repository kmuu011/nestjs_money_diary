import {Injectable} from '@nestjs/common';
import {MemberEntity} from "../member/entities/member.entity";
import {DeleteResult, QueryRunner, UpdateResult} from "typeorm";
import {Message} from "../../../libs/message";
import {AccountIncomeOutcomeType, SelectListResponseType} from "../../common/type/type";
import {InjectRepository} from "@nestjs/typeorm";
import {AccountRepository} from "./account.repository";
import {AccountEntity} from "./entities/account.entity";
import {UpdateAccountDto} from "./dto/update-account-dto";
import {CreateAccountDto} from "./dto/create-account-dto";

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountRepository) private readonly accountRepository: AccountRepository,
    ) {}

    async arrangeOrder(member: MemberEntity, account?: AccountEntity, order?: number): Promise<void> {
        const accountList = (await this.accountRepository.selectList(member))[0];
        let splicedAccountList = [...accountList];

        if (account) {
            splicedAccountList.splice(accountList.findIndex(v => v.idx === account.idx), 1);

            if (order === 1) {
                splicedAccountList.push(account);
            } else if (order === accountList.length) {
                splicedAccountList.unshift(account);
            } else {
                const targetIdx = accountList.findIndex(v => v.order === order);

                splicedAccountList = [
                    ...splicedAccountList.slice(0, targetIdx),
                    account,
                    ...splicedAccountList.slice(targetIdx, splicedAccountList.length)
                ];
            }
        }

        for (let i = 0; i < splicedAccountList.length; i++) {
            splicedAccountList[i].order = splicedAccountList.length - i;

            const updateResult: UpdateResult = await this.accountRepository.updateAccount(undefined, splicedAccountList[i]);

            if (updateResult.affected !== 1) {
                throw Message.SERVER_ERROR;
            }
        }
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

    async selectList(member: MemberEntity, page: number, count: number): Promise<SelectListResponseType<AccountEntity>> {
        const result = await this.accountRepository.selectList(member, page, count);

        return {
            items: result[0],
            page,
            count,
            totalCount: result[1],
            last: Math.ceil(result[1] / count) || 1
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
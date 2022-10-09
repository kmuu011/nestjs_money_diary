import {Injectable} from '@nestjs/common';
import {SelectListResponseType} from "../../../common/type/type";
import {AccountEntity} from "../entities/account.entity";
import {CreateAccountHistoryDto} from "./dto/create-accountHistory-dto";
import {UpdateAccountHistoryDto} from "./dto/update-accountHistory-dto";
import {DeleteResult, UpdateResult} from "typeorm";
import {Message} from "../../../../libs/message";
import {InjectRepository} from "@nestjs/typeorm";
import {AccountHistoryRepository} from "./accountHistory.repository";
import {AccountHistoryEntity} from "./entities/accountHistory.entity";

@Injectable()
export class AccountHistoryService {
    constructor(
        @InjectRepository(AccountHistoryRepository) private readonly accountHistoryRepository: AccountHistoryRepository
    ) {}

    async selectOne(account: AccountEntity, accountHistoryIdx: number): Promise<AccountHistoryEntity> {
        return await this.accountHistoryRepository.selectOne(account, accountHistoryIdx);
    }

    async selectList(account: AccountEntity, page: number, count: number): Promise<SelectListResponseType<AccountHistoryEntity>> {
        const result = await this.accountHistoryRepository.selectList(account, page, count);

        return {
            items: result[0],
            page,
            count,
            totalCount: result[1],
            last: Math.ceil(result[1] / count) || 1
        };
    }

    async create(account: AccountEntity, createTodoDto: CreateAccountHistoryDto): Promise<AccountHistoryEntity> {
        const accountHistory: AccountHistoryEntity = new AccountHistoryEntity();

        accountHistory.dataMigration(createTodoDto);
        accountHistory.account = account;

        return this.accountHistoryRepository.createAccountHistory(accountHistory);
    }

    async update(accountHistory: AccountHistoryEntity, updateTodoDto: UpdateAccountHistoryDto): Promise<UpdateResult> {
        accountHistory.dataMigration(updateTodoDto);

        const updateResult: UpdateResult = await this.accountHistoryRepository.updateAccountHistory(accountHistory, updateTodoDto);

        if (updateResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        return updateResult;
    }

    async delete(accountHistory: AccountHistoryEntity): Promise<DeleteResult> {
        const deleteResult: DeleteResult = await this.accountHistoryRepository.deleteAccountHistory(accountHistory);

        if (deleteResult.affected !== 1) {
            throw Message.SERVER_ERROR;
        }

        return deleteResult;
    }

}

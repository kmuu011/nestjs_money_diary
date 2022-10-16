import {BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsDateString, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {AccountEntity} from "../../entities/account.entity";
import {AccountHistoryCategoryEntity} from "../category/entities/accountHistoryCategory.entity";

@Entity({name: 'accountHistory'})
export class AccountHistoryEntity extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    @Column({primary: true, type: "int", unique: true, unsigned: true})
    @ApiProperty({
        example: 3
    })
    idx: number = undefined;

    @ManyToOne(() => AccountEntity,
            account => account.accountHistoryList,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            nullable: false
        }
    )
    @JoinColumn()
    account: AccountEntity = undefined;

    @ManyToOne(() => AccountHistoryCategoryEntity,
        accountHistoryCategory => accountHistoryCategory.accountHistory,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            nullable: false
        }
    )
    @JoinColumn()
    @ApiProperty({
        example: {
            idx: 1
        }
    })
    accountHistoryCategory: AccountHistoryCategoryEntity = undefined;

    @IsNumber()
    @Column({type: "bigint", unsigned: true, comment: "금액"})
    @ApiProperty({
        example: 1000
    })
    amount: number = undefined;

    @IsString()
    @Column({type: "varchar", comment: "간단 설명", length: 100})
    @ApiProperty({
        example: "점심값"
    })
    content: string = undefined;

    @IsNumber()
    @Column({type: "tinyint", comment: "구분 0: 지출, 1: 수입"})
    @ApiProperty({
        example: 0
    })
    type: number = undefined;

    @IsDateString()
    @Column({type: "timestamp", default: () => "now", comment: "생성 일자"})
    @ApiProperty({
        example: "2022-08-29T06:48:31.000Z"
    })
    createdAt: string = undefined;

    @IsDateString()
    @Column({type: "timestamp", default: () => "now", comment: "수정 일자"})
    @ApiProperty({
        example: "2022-08-29T06:48:31.000Z"
    })
    updatedAt: string = undefined;

    dataMigration(object: object): void {
        for (let k in new AccountHistoryEntity()) {
            if (object[k] === undefined) continue;
            this[k] = object[k];
        }
    }

}
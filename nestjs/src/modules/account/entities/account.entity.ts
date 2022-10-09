import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsDateString, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {MemberEntity} from "../../member/entities/member.entity";
import {AccountHistoryEntity} from "../history/entities/accountHistory.entity";

@Entity({name: 'account'})
export class AccountEntity extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    @Column({primary: true, type: "int", unique: true, unsigned: true})
    @ApiProperty({
        example: 3
    })
    idx: number = undefined;

    @ManyToOne(() => MemberEntity, member => member.todoGroupList, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        nullable: false
    })
    @JoinColumn()
    member: MemberEntity = undefined;

    @OneToMany(() => AccountHistoryEntity,
        accountHistory => accountHistory.account, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        })
    @JoinColumn()
    accountHistoryList: AccountHistoryEntity[];

    @IsString()
    @Column({type: 'varchar', length: 100, comment: '가계부 제목'})
    @ApiProperty({
        example: '가계부 제목 1'
    })
    accountName: string = undefined;

    @IsNumber()
    @Column({type: 'bigint', unsigned: false, comment: '가계부 금액'})
    @ApiProperty({
        example: 0
    })
    totalAmount: number = undefined;

    @IsNumber()
    @Column({type: 'tinyint', comment: '가계부 금액 보이기 여부'})
    @ApiProperty({
        example: 0
    })
    invisibleAmount: number = undefined;

    @IsNumber()
    @Column({type: "tinyint", default: 1, comment: "순서"})
    @ApiProperty({
        example: 1
    })
    order: number = undefined;

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
        for (let k in new AccountEntity()) {
            if (object[k] === undefined) continue;
            this[k] = object[k];
        }
    }
}
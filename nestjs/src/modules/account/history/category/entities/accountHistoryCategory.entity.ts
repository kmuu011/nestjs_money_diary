import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {IsDateString, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {AccountHistoryEntity} from "../../entities/accountHistory.entity";
import {MemberEntity} from "../../../../member/entities/member.entity";

@Entity({name: 'accountHistoryCategory'})
export class AccountHistoryCategoryEntity extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    @Column({primary: true, type: "int", unique: true, unsigned: true})
    @ApiProperty({
        example: '3'
    })
    idx: number = undefined;

    @ManyToOne(() => MemberEntity,
        member => member.accountList,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            nullable: false
        }
    )
    @JoinColumn()
    member: MemberEntity = undefined;

    @OneToMany(() => AccountHistoryEntity,
        accountHistory => accountHistory.accountHistoryCategory
    )
    accountHistory: AccountHistoryEntity;

    @IsNumber()
    @Column({
        type: "tinyint",
        comment: "고정 여부 (1: 회원가입시 자동생성된 카테고리)",
        default: 0
    })
    @ApiProperty({
        example: 1
    })
    default: number = undefined;

    @IsNumber()
    @Column({type: "tinyint", comment: "구분 0: 지출, 1: 수입"})
    @ApiProperty({
        example: 0
    })
    type: number = undefined;

    @IsString()
    @Column({type: "varchar", length: 10, comment: "색상"})
    @ApiProperty({
        example: 'f1f1f1'
    })
    color: string = undefined;

    @IsString()
    @Column({type: "varchar", length: 10, comment: "카테고리 명"})
    @ApiProperty({
        example: '식비'
    })
    name: string = undefined;

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
        for (let k in new AccountHistoryCategoryEntity()) {
            if (object[k] === undefined) continue;
            this[k] = object[k];
        }
    }
}
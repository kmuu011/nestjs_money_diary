import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsDateString, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {MemberEntity} from "../../../entities/member.entity";

@Entity({name: 'saleKeyword'})
export class SaleKeywordEntity extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    @Column({primary: true, type: "int", unique: true, unsigned: true})
    @ApiProperty({
        example: '3'
    })
    idx: number = undefined;

    @ManyToOne(() => MemberEntity, member => member.saleKeywordList,
        {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            nullable: false
        }
    )
    @JoinColumn()
    member: MemberEntity = undefined;

    @IsString()
    @Column({type: 'varchar', length: 100, comment: '키워드'})
    @ApiProperty({
        example: '닭가슴살'
    })
    keyword: string = undefined;

    @IsDateString()
    @Column({type: "timestamp", default: () => "now", comment: "생성 일자"})
    @ApiProperty({
        example: "2022-08-29T06:48:31.000Z"
    })
    createdAt: string = undefined;

    dataMigration(object: object): void {
        for (let k in new SaleKeywordEntity()) {
            if (object[k] === undefined) continue;
            this[k] = object[k];
        }
    }
}
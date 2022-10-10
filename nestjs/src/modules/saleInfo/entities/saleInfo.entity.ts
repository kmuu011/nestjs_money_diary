import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsDateString, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'saleInfo'})
export class SaleInfoEntity extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    @Column({primary: true, type: "int", unique: true, unsigned: true})
    @ApiProperty({
        example: '3'
    })
    idx: number = undefined;

    @IsString()
    @Column({
        type: 'varchar', length: 30, comment: '할인 글 유니크 키',
        unique: true
    })
    @ApiProperty({
        example: 'qz954276'
    })
    uniqueKey: string = undefined;

    @IsString()
    @Column({type: 'varchar', length: 500, comment: '할인 글 제목'})
    @ApiProperty({
        example: '[티몬] 닭가슴살 역대 할인 정보 (9,900원)'
    })
    title: string = undefined;

    @IsString()
    @Column({type: 'varchar', length: 20, comment: '할인 글 카테고리'})
    @ApiProperty({
        example: '생활/식품'
    })
    category: string = undefined;

    @IsNumber()
    @Column({type: 'bigint', comment: '할인 글 금액'})
    @ApiProperty({
        example: 9900
    })
    price: number = undefined;

    @IsString()
    @Column({type: 'varchar', length:5, comment: '할인 글 금액 구분'})
    @ApiProperty({
        example: '\\'
    })
    priceType: string = undefined;

    @IsString()
    @Column({type: 'varchar', length: 800, comment: '할인 글 url'})
    @ApiProperty({
        example: 'https://quasarzone.com/bbs/qb_saleinfo/views/954276'
    })
    url: string = undefined;

    @IsString()
    @Column({type: 'varchar', length: 800, comment: '할인 글 상태'})
    @ApiProperty({
        example: '종료'
    })
    state: string = undefined;

    @IsNumber()
    @Column({
        type: 'tinyint',
        comment: '할인 글 출처 구분 (0: 퀘이사존, 1: 뽐뿌 등)'
    })
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
        for (let k in new SaleInfoEntity()) {
            if (object[k] === undefined) continue;
            this[k] = object[k];
        }
    }
}
import {IsNumber, IsString} from "class-validator";

import {
    BaseEntity,
    Column,
    Entity, JoinColumn, OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {MemberEntity} from "./member.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'memberToken'})
export class TokenEntity extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    @Column({primary: true, type: "int", unique: true, unsigned: true})
    @ApiProperty({
        example: '3'
    })
    idx: number = undefined

    @OneToOne(() => MemberEntity, member => member.tokenInfo, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        nullable: false
    })
    @JoinColumn()
    member: MemberEntity = undefined;

    @IsString()
    @Column({type: 'varchar', length: 1000, comment: '최근 사용 토큰'})
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjMsImlkIjoidHRzIiwibmlja25hbWUiOiJ0dHMiLCJ1c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwNC4wLjAuMCBTYWZhcmkvNTM3LjM2Iiwia2VlcF9jaGVjayI6dHJ1ZSwiY3JlYXRlZF9hdCI6IjIwMjItMDgtMjhUMTM6MjQ6MDguMDAwWiIsInRpbWUiOjE2NjE2OTY3MDM0NDQsImlhdCI6MTY2MTY5NjcwMywiZXhwIjoxNjY0Mjg4NzAzfQ.X2RlMAeluOA3fzq8hhxRwAfQF-nromnWh5snbhWzFp8'
    })
    token: string = undefined;

    @IsString()
    @Column({type: "varchar", unique: true, length: 50, comment: "유니크 코드"})
    @ApiProperty({
        example: 'opas4dyl4ly0ilq8dlgn95jrffwv0fi4ytto6xhy'
    })
    code: string = undefined;

    dataMigration(object: object) : void {
        for (let k in new TokenEntity()) {
            if (object[k] === undefined) continue;
            this[k] = object[k];
        }
    }

}
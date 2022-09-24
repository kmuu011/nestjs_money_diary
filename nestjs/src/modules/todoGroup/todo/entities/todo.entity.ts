import {IsDateString, IsNumber, IsString} from "class-validator";

import {
    BaseEntity,
    Column,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {TodoGroup} from "../../entities/todoGroup.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'todo'})
export class Todo extends BaseEntity {
    @IsNumber()
    @PrimaryGeneratedColumn()
    @Column({primary: true, type: "int", unique: true, unsigned: true})
    @ApiProperty({
        example: 1
    })
    idx: number = undefined

    @ManyToOne(() => TodoGroup, todoGroup => todoGroup.todoList, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        nullable: false
    })
    @JoinColumn()
    todoGroup: TodoGroup = undefined;

    @IsString()
    @Column({type: 'varchar', length: 300, comment: '할일 내용'})
    @ApiProperty({
        example: '밥먹기'
    })
    content: string = undefined;

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

    @IsDateString()
    @Column({type: "timestamp", nullable: true, comment: "완료 일자"})
    @ApiProperty({
        example: "2022-08-29T06:48:31.000Z"
    })
    completedAt: string = undefined;

    dataMigration(object: object): void {
        for (let k in new Todo()) {
            if (object[k] === undefined) continue;
            this[k] = object[k];
        }
    }
}
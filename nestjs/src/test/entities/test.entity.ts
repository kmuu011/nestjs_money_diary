import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity({ name: 'test' })
@Unique(['idx'])
export class Test extends BaseEntity {
    @PrimaryGeneratedColumn()
    idx: number = undefined;

    @Column({ type: 'varchar', length: 50, comment: '유저 이름' })
    name: string = undefined;

    say(){
        console.log(this.name + ' 입니다.');
    }

}
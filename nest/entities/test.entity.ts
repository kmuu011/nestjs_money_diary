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
    idx: number;

    @Column({ type: 'varchar', length: 50, comment: '유저 이름' })
    name: string;

}
import {EntityRepository, Repository, Like, DeleteResult} from "typeorm";
import {TestDto} from "./dto/test.dto";
import {TestSelectDto} from "./dto/test.selectDto";
import {Test} from "./entities/test.entity";

@EntityRepository(Test)
export class TestRepository extends Repository<Test> {

    async select(testSelectDto: TestSelectDto): Promise<Test[]> {
        const {name} = testSelectDto;
        const where: any = {};

        if (name !== undefined) {
            where.name = Like(`%${name}%`);
        }

        return await this.find(where);
    }

    async selectOne(idx: number): Promise<Test> {
        return await this.findOne(idx);
    }

    async onCreate(testDto: TestDto): Promise<Test> {
        return await this.save(testDto);
    }

    async deleteTest(idx: number): Promise<DeleteResult> {
        return await this.delete(idx);
    }

}
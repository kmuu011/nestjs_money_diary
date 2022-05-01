import {EntityRepository, Repository, Like} from "typeorm";
import {Test} from "entities/test.entity";
import {TestDto} from "./dto/test.dto";
import {TestSelectDto} from "./dto/test.selectDto";

@EntityRepository(Test)
export class TestRepository extends Repository<Test>{

    async findAll(testSelectDto: TestSelectDto): Promise<Test[]> {
        const { name } = testSelectDto;
        const where: any = {};

        if(name !== undefined){
            where.name = Like(`%${name}%`);
        }

        return await this.find(where);
    }

    async onCreate(testDto: TestDto): Promise<Test> {
        return await this.save({
            name: testDto.name
        });
    }

}
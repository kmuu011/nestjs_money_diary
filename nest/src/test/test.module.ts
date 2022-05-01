import {Module} from '@nestjs/common';
import {TestController} from './test.controller';
import {Member} from "../member/model/member.model";

import {TypeOrmModule} from "@nestjs/typeorm";
import {TestRepository} from "./test.repository";

@Module({
    imports: [TypeOrmModule.forFeature([TestRepository])],
    controllers: [TestController],
    providers: [Member],
})

export class TestModule {}

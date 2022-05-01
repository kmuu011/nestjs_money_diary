import {Module} from '@nestjs/common';
import {TestController} from './test.controller';
import {Member} from "../member/model/member.model";

@Module({
    imports: [],
    controllers: [TestController],
    providers: [Member],
})

export class TestModule {}

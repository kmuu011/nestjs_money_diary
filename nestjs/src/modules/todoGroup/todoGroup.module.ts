import {Global, Module} from '@nestjs/common';
import {TodoGroupController} from './todoGroup.controller';
import {TodoGroupService} from './todoGroup.service';
import {TodoModule} from "./todo/todo.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TodoGroupRepository} from "./todoGroup.repository";
import {TodoRepository} from "./todo/todo.repository";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            TodoRepository,
            TodoGroupRepository,
        ]),
        TodoModule
    ],
    controllers: [TodoGroupController],
    providers: [TodoGroupService],
    exports: [
        TypeOrmModule.forFeature([
            TodoRepository,
            TodoGroupRepository,
        ]),
        TodoGroupService,
    ]
})

export class TodoGroupModule {}

import {Module} from '@nestjs/common';
import {TodoController} from "./todo.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TodoRepository} from "./todo.repository";
import {TodoService} from "./todo.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TodoRepository,
        ]),
    ],
    controllers: [TodoController],
    providers: [TodoService],
})

export class TodoModule {
}

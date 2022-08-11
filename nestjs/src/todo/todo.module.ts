import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoFileController } from "./file/file.controller";

import { TodoService } from './todo.service';
import { TodoFileService } from "./file/file.service";


@Module({
    imports: [],
    controllers: [TodoController, TodoFileController],
    providers: [TodoService, TodoFileService],
})

export class TodoModule {}

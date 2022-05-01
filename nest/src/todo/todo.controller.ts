import {All, Controller, Get, Next, Param, Req} from '@nestjs/common';
import {TodoService} from './todo.service';
import {NextFunction, Request} from "express";

@Controller('/todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @All(['', '*'])
    test(@Next() next:NextFunction): void{
        next()
    }

    @Get()
    getList(@Req() req: Request){
        console.log(req['member_info']);
        return this.todoService.getList();
    }

    @Get('/:todo_idx(\\d+)')
    getOne(@Req() req: Request, @Param('todo_idx') todo_idx : number){
        console.log(req['member_info']);
        return `list  ${todo_idx}`;
    }

}

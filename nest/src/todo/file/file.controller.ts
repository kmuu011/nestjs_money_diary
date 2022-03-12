import {All, Controller, Get, Next} from '@nestjs/common';
import {TodoFileService} from "./file.service";
import { Request, NextFunction } from 'express';

@Controller(':todo_idx/file')
export class TodoFileController {
    constructor(private readonly  todoFileService: TodoFileService) {}


    @Get()
    getList(){
        return this.todoFileService.getList();
    }
}
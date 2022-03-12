import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {

    getList(): object[] {
        return [{name:'미누'}];
    }
}

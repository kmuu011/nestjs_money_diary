import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {

    getList(): object[] {
        console.log('TodoService : getList()')
        return [{name:'미누'}];
    }
}

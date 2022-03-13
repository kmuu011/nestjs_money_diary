import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {

    getList(): object[] {
        console.log('MemberService : getList()');
        return [{name:'미누'}];
    }
}

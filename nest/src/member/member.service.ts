import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {

    getList(): object[] {
        return [{name:'미누'}];
    }
}

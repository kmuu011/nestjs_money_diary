import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoFileService {

    getList(): object[] {
        return [{file:'파일 받아라~'}];
    }
}

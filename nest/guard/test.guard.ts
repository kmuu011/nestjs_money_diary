import {Injectable, CanActivate, ExecutionContext, ArgumentsHost} from '@nestjs/common';
import { Observable } from 'rxjs';
import {Message} from "../libs/message";

@Injectable()
export class TestGuard implements CanActivate {
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {


        console.log('test');
        return true;
    }
}

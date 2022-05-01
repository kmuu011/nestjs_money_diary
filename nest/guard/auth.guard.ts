import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Member} from "../src/member/model/member.model";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private member: Member) {}

    async canActivate(
        context: ExecutionContext
    ) {
        const req = context.switchToHttp().getRequest();

        this.member.dataMigration({token: req.headers['x-token']});

        await this.member.decodeToken()

        return true;
    }
}

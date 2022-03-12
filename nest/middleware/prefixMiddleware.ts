import { Injectable, NestMiddleware } from '@nestjs/common';
import {NextFunction, Request, Response} from "express";
import xss from 'libs/xss';
import utils from 'libs/utils';

@Injectable()
export class PrefixMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        await xss.check(req.body);
        await xss.check(req.query);

        await utils.deActiveQuestionMark(req.body);
        await utils.deActiveQuestionMark(req.query);

        next();
    }
}
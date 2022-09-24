import {LocalsType} from "../type/type";

declare module 'express' {
    export interface Request {
        locals: LocalsType
    }
}
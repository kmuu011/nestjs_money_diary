import {SelectQueryDto} from "../../src/common/dto/select-query-dto";
import {CallHandler, ExecutionContext} from "@nestjs/common";
import {ExecutionContextHost} from "@nestjs/core/helpers/execution-context-host";

export const getSelectQueryDto = (page?: number, count?: number): SelectQueryDto => {
    return {
        page: page || 1,
        count: count || 10
    }
}

export const getExecutionContext = (req, res): ExecutionContext => {
    return new ExecutionContextHost([req, res]);
}

export const getCallHandler = (): CallHandler => {
    return {
        handle: jest.fn()
    };
}



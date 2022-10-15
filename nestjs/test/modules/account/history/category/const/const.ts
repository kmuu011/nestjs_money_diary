import {
    SelectAccountHistoryCategoryDto
} from "../../../../../../src/modules/account/history/category/dto/select-accountHistoryCategory-dto";

export const getAccountHistoryCategorySelectQueryDto = (type: number): SelectAccountHistoryCategoryDto => {
    return {
        type
    }
}
import {HttpException, HttpStatus} from "@nestjs/common";
import {keyDescription} from "./messageKeyDescription";

export class Message extends HttpException {
    static INVALID_PARAM(name) {
        return new HttpException({
            error: `invalid_parameter_${name}`,
            message: `${keyDescription[name]}을(를) 입력해주세요.`
        }, HttpStatus.BAD_REQUEST);
    }

    static WRONG_PARAM(name) {
        return new HttpException({
            error: `wrong_param_${name}`,
            message: `${keyDescription[name]}이(가) 올바르지 않습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static INCLUDE_BAN_KEYWORD(name) {
        return new HttpException({
            error: `include_ban_keyword_${name}`,
            message: `${keyDescription[name]}에 사용할 수 없는 값이 포함되어있습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static NOT_EXIST(name) {
        return new HttpException({
            error: `not_exist_${name}`,
            message: `${keyDescription[name]}이(가) 존재하지 않습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static CUSTOM_ERROR(message) {
        return new HttpException({
            error: `custom_error`,
            message: message
        }, HttpStatus.BAD_REQUEST);
    }

    static TOO_LARGE_SIZE_FILE(size) {
        return new HttpException({
            error: `too_large_size_file`,
            message: `${size}MB 이하 파일만 업로드 할 수 있습니다.`
        }, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    static MAX_SALE_KEYWORD_COUNT(cnt) {
        return new HttpException({
            error: `max_sale_keyword_count`,
            message: `키워드는 최대 ${cnt}개 까지만 등록할 수 있습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static ALREADY_EXIST(key) {
        return new HttpException({
            error: `already_exist`,
            message: `이미 존재하는 ${keyDescription[key]} 입니다.`
        }, HttpStatus.BAD_REQUEST);
    }


    static get CONNECTED_SNS() {
        return new HttpException({
            error: `connected_sns`,
            message: `SNS로그인으로 연결된 계정입니다.\n' +
            '연결한 SNS로그인으로 시도해주세요.`
        }, HttpStatus.BAD_REQUEST);
    }

    static get FORBIDDEN() {
        return new HttpException({
            error: `forbidden`,
            message: `해당 기능을 수행할 수 있는 권한이 없습니다.`
        }, HttpStatus.FORBIDDEN);
    }

    static get UNAUTHORIZED() {
        return new HttpException({
            error: `unauthorized`,
            message: `로그인 정보가 존재하지 않습니다.`
        }, HttpStatus.UNAUTHORIZED);
    }

    static get WRONG_ID_OR_PASSWORD() {
        return new HttpException({
            error: `wrong_id_or_password`,
            message: `아이디 혹은 비밀번호가 일치하지 않습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static get CAN_NOT_ACTION_DEFAULT() {
        return new HttpException({
            error: `can_not_action_default`,
            message: `기본값은 삭제 또는 변경할 수 없습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static FILE_TOO_LARGE(maxSize) {
        return new HttpException({
            error: `file_too_large`,
            message: `${maxSize}mb 이하만 업로드할 수 있습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static get EXPIRED_TOKEN() {
        return new HttpException({
            error: `expired_token`,
            message: `토큰이 만료되었습니다.`
        }, HttpStatus.UNAUTHORIZED);
    }


    static get SERVER_ERROR() {
        return new HttpException({
            error: 'server_error',
            message: '예기치 않은 오류가 발생했습니다.\n잠시 뒤에 다시 시도해주세요.'
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
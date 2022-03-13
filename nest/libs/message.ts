import {HttpException, HttpStatus} from "@nestjs/common";

export class Message extends HttpException{
    static INVALID_PARAM(name) {
        return new HttpException({
            code: `invalid_parameter_${name}`,
            description: `${name} 을(를) 입력해주세요.`
        }, HttpStatus.BAD_REQUEST);
    }

    static WRONG_PARAM(name) {
        return new HttpException({
            code: `wrong_param_${name}`,
            description: `${name} 이(가) 올바르지 않습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static INCLUDE_BAN_KEYWORD(name) {
        return new HttpException({
            code: `include_ban_keyword_${name}`,
            description: `${name} 에 사용할 수 없는 값이 포함되어있습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static NOT_EXIST(name) {
        return new HttpException({
            code: `not_exist_${name}`,
            description: `${name} 이(가) 존재하지 않습니다.`
        }, HttpStatus.NOT_FOUND);
    }

    static DETAIL_ERROR(message) {
        return new HttpException({
            code: `already_exist_${name}`,
            description: message
        }, HttpStatus.BAD_REQUEST);
    }

    static TOO_LARGE_SIZE_FILE(size) {
        return new HttpException({
            code: `too_large_size_file`,
            description: `${size}MB 이하 파일만 업로드 할 수 있습니다.`
        }, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    static MAX_SALE_KEYWORD_COUNT(cnt) {
        return new HttpException({
            code: `max_sale_keyword_count`,
            description: `키워드는 최대 ${cnt}개 까지만 등록할 수 있습니다.`
        }, HttpStatus.BAD_REQUEST);
    }




    static get CONNECTED_SNS() {
        return new HttpException({
            code: `connected_sns`,
            description: `SNS로그인으로 연결된 계정입니다.\n' +
            '연결한 SNS로그인으로 시도해주세요.`
        }, HttpStatus.BAD_REQUEST);
    }
    static get FORBIDDEN() {
        return new HttpException({
            code: `forbidden`,
            description: `해당 기능을 수행할 수 있는 권한이 없습니다.`
        }, HttpStatus.FORBIDDEN);
    }

    static get UNAUTHORIZED() {
        return new HttpException({
            code: `unauthorized`,
            description: `로그인 정보가 존재하지 않습니다.`
        }, HttpStatus.UNAUTHORIZED);
    }

    static get WRONG_ID_OR_PASSWORD() {
        return new HttpException({
            code: `wrong_id_or_password`,
            description: `아이디 혹은 비밀번호가 일치하지 않습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static get CAN_NOT_ACTION_DEFAULT() {
        return new HttpException({
            code: `can_not_action_default`,
            description: `기본값은 삭제 또는 변경할 수 없습니다.`
        }, HttpStatus.BAD_REQUEST);
    }

    static get EXPIRED_TOKEN() {
        return new HttpException({
            code: `expired_token`,
            description: `토큰이 만료되었습니다.`
        }, HttpStatus.UNAUTHORIZED);
    }


    static get SERVER_ERROR() {
        return new HttpException({
            code: 'server_error',
            description: '예기치 않은 오류가 발생했습니다.\n잠시 뒤에 다시 시도해주세요.'
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
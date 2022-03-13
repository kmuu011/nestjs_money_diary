import {HttpException, HttpStatus} from "@nestjs/common";

class Message extends HttpException{

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

export default Message;

// class Message extends Error {
//     public status: number;
//     public code: number;
//     public message: string;
//
//     constructor(status, code, message) {
//         super(message);
//
//         this.status = status;
//         this.code = code;
//         this.message = message;
//     }
//
//     toJSON() {
//         return {
//             status: this.status,
//             code: this.code,
//             message: this.message
//         };
//     }
//
//     /**
//      * Not Founds
//      */
//     static INVALID_PARAM(name) {
//         return new Message(400, `invalid_parameter_${name}`, name + '을(를) 입력해주세요.');
//     }
//
//     static WRONG_PARAM(name) {
//         return new Message(400, 'wrong_param_' + name, name + '을(를) 잘못 입력했습니다.');
//     }
//
//     static INCLUDE_BAN_KEYWORD(name) {
//         return new Message(400, 'include_ban_keyword_' + name, name + '에 사용할 수 없는 값이 포함되어있습니다.');
//     }
//
//     static ALREADY_EXIST(name) {
//         return new Message(400, 'already_exist_' + name, '이미 존재하는 ' + name + ' 입니다.');
//     }
//
//     static get WRONG_ID_OR_PASSWORD() {
//         return new Message(400, 'wrong_id_or_password', '아이디 혹은 비밀번호가 일치하지 않습니다.');
//     }
//
//     static NOT_EXIST(name) {
//         return new Message(400, 'not_exist_' + name, '존재하지 않는 ' + name + ' 입니다.');
//     }
//
//     static get EXPIRED_TOKEN() {
//         return new Message(400, 'expired_token', '토큰이 만료되었습니다.');
//     }
//
//     static get CAN_NOT_ACTION_DEFAULT() {
//         return new Message(400, 'can_not_action_default', '기본값은 삭제 또는 변경할 수 없습니다.');
//     }
//
//     static DETAIL_ERROR(message) {
//         return new Message(400, 'detail_error', message);
//     }
//
//     static get UNAUTHORIZED() {
//         return new Message(401, 'unauthorized', '로그인 정보가 존재하지 않습니다. 로그인 해주세요.');
//     }
//
//     static get FORBIDDEN() {
//         return new Message(403, 'forbidden', '권한 없음');
//     }
//
//     static TOO_LARGE_SIZE_FILE(size) {
//         return new Message(400, 'too_large_size_file', size+'MB 이하 파일만 업로드 할 수 있습니다.');
//     }
//
//     static get CONNECTED_SNS() {
//         return new Message(400, `connected_sns`, 'SNS로그인으로 연결된 계정입니다.\n' +
//             '연결한 SNS로그인으로 시도해주세요.');
//     }
//
//     static MAX_SALE_KEYWORD(cnt) {
//         return new Message(400, 'max_sale_keyword', '키워드는 ' + cnt + '개 까지만 등록할 수 있습니다.');
//     }
//
//
//
//     static get SERVER_ERROR() {
//         return new Message(500, 'Server_error', 'Please try again.');
//     }
//
//
//     // static is(target, message) {
//     //     if (!(target instanceof Message)) {
//     //         return false;
//     //     }
//     //
//     //     if (arguments.length === 1) {
//     //         return true;
//     //     }
//     //
//     //     return target.status === message.status &&
//     //         target.code === message.code;
//     // }
//
// }
//
//
// export default Message;
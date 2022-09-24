/**
 * 서버를 시작하기 전 이 파일의 이름을 config.ts로 변경해주세요.
 * */

import {TypeOrmModuleOptions} from "@nestjs/typeorm";

const dirPath = __dirname.substring(0, __dirname.lastIndexOf('nestjs')+'nestjs'.length);

const SERVER_TYPE = process.env.NODE_ENV;

export const serverType = SERVER_TYPE;

export const typeOrmOptions: TypeOrmModuleOptions = {
    type: 'mysql', //Database 설정
    host: '127.0.0.1',
    port: 3306,
    username: 'user',
    password: 'password',
    database: 'database',
    entities: ['dist/**/*.entity.{ts,js}'], // Entity 연결
    synchronize: true, //true 값을 설정하면 어플리케이션을 다시 실행할 때 엔티티안에서 수정된 컬럼의 길이, 타입등의 변경된 해당 테이블을 Drop한 후 다시 생성해준다.
};

export const port = 80;

export const redis = {
    host: '127.0.0.1'
}

export const cipher = {
    key: 'cipherKey',
    twoWayAlgorithm: 'aria-256-cbc'
}

export const auth = {
    salt: 'authSalt',
    jwtSecret: 'jwtSecret',
    hashAlgorithm: 'sha512',
    expireTime: 60 * 60 * 24 * 30,
    tokenRefreshTime: 60 * 60 * 24
}

export const multerOptions = {
    limits: {
        fileNameSize: 100,
        fileSize: 1024 * 1024 * 100, // 100MB
        fields: 10,
        files: 10
    }
}

export const basePath = dirPath + '/';
export const staticPath = dirPath + '/static/';

export const filePath = {
    profileImg: 'profileImgs/'
}

export const sentry = {
    dsn: "https://setry.io",
    environment: SERVER_TYPE,
    release: "releaseVersion@" + process.env.npm_package_version,
    tracesSampleRate: 1.0,
    autoSessionTracking: false,
    integrations: []
}

export const sentryConfig = {
    token: "sentryToken",
    org: "sentryOrg",
    project: "sentryProject"
}

export const slack = {
    apiLogHook: "https://hooks.slack.com/apiLogHook"
}

export const swaggerUser = {
    id: 'test',
    password: 'test0000'
}

export const testTokenCode = 'loginTokenCode';
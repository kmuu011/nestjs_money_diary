import {TypeOrmModuleOptions} from "@nestjs/typeorm";

const dirPath = __dirname.substring(0, __dirname.lastIndexOf('nestjs')+'nestjs'.length);

let SERVER_TYPE = process.env.NODE_ENV;

if (SERVER_TYPE === 'scheduler') {
    SERVER_TYPE = 'production';
}

function dataSeparator(productData, developData, localDevData, testData) {
    switch(SERVER_TYPE){
        case 'production': return productData;
        case 'development': return developData;
        case 'localDevelopment': return localDevData;
        case 'test': return testData;
    }
}

export const serverType = SERVER_TYPE;

export const typeOrmOptions: TypeOrmModuleOptions = {
    type: 'mysql', //Database 설정
    host: dataSeparator('192.168.0.12', '192.168.0.12', '127.0.0.1', '127.0.0.1'),
    port: 3306,
    username: dataSeparator('tester', 'tester', 'root', 'root'),
    password: 'password+',
    database: dataSeparator('DBName', 'DBName', 'DBName', 'DBNameTest'),
    entities: dataSeparator(['dist/**/*.entity.{ts,js}'], ['dist/**/*.entity.{ts,js}'],
        ['dist/**/*.entity.{ts,js}'], ['**/*.entity.{ts,js}']), // Entity 연결
    synchronize: true, //true 값을 설정하면 어플리케이션을 다시 실행할 때 엔티티안에서 수정된 컬럼의 길이, 타입등의 변경된 해당 테이블을 Drop한 후 다시 생성해준다.
};

export const port = 8100;

export const redis = {
    host: dataSeparator('172.18.0.4', '172.18.0.4', 'localhost', 'localhost')
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
        fileNameSize: 200,
        fileSize: 1024 * 1024 * 100,
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
    dsn: "https://sentryDSN",
    environment: SERVER_TYPE,
    release: "releaseName@" + process.env.npm_package_version,
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
    apiLogHook: "slackApiLogHook"
}

export const swagger = {
    url: '/api-docs',
    title: 'NestJS Money Diary',
    description: ' ',
    adminInfo: {
        id: 'test',
        password: 'test0000'
    },
    dummyUserInfo: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjEyMCwiaWQiOiJuMHluaml1MnRqdzciLCJuaWNrbmFtZSI6Im4weW5qaXUydGp3NyIsImlwIjoiMTI3LjAuMC4xIiwidXNlckFnZW50IjoidGVzdC1hZ2VudCIsImtlZXBDaGVjayI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMjItMTAtMDlUMTI6MzI6MTEuMDAwWiIsInRpbWUiOjE2NjUzMTg3MzE0NTQsImlhdCI6MTY2NTMxODczMSwiZXhwIjo0ODE4OTE4NzMxfQ.MTESSqWjFV9mYReI2BF-0inbEzKnqwOysHBmhuv1IAI',
        tokenCode: 'j8quvthu89vnrodf3t9ug1wj5vf0e9z6fnmmlukc',
        id: 'tts',
        password: 'tts0000',
        nickname: 'tts',
        email: 'tts@tts.com'
    }
}

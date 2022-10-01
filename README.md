# 프로젝트 설명
Nest JS 기반의 가계부 서비스를 구현할 예정으로
현재 Nest JS BoilerPlate를 클론한 상태임.

### DB
Mysql과 TypeORM으로 구성

### Error Logging
sentry로 구성

# Api 문서화 환경 및 접속 방법
Swagger로 구성

http://127.0.0.1:8081/api-docs

| 아이디  | 비밀번호      |
|------|-----------|
| test | test0000  |

# 실행 방법
```bash
#nestjs 폴더로 이동
cd nestjs

#서버 실행
npm run start:dev
```

### docker-compose 환경에서 실행
```bash
# nestjs_boilerplate 폴더에서 실행할 것
docker-compose -f docker-compose-dev up
```

## 주의사항
nestjs/config/example.ts 파일의 이름을

nestjs/config/config.ts로 변경해서 사용할것!

# 커밋 타입
| 키워드      | 설명                               |
|----------|----------------------------------|
| feat     | 새로운 기능                           |
| fix      | 버그 수정                            |
| refactor | 리팩토링                             |
| css      | css 관련 퍼블리싱 수정                   |
| style    | 코드 형식, 정렬, 주석 등 동작에 영향을 안주는 변경사항 |
| test     | 테스트 코드 관련 내용                     |
| docs     | 문서 수정 (제품 코드 수정 X)               |
| devops   | devops 관련 수정                     |
| swagger  | swagger 관련 수정                    |
| etc      | 이외 위에서 해당하지 않는 모든 수정사항           |  

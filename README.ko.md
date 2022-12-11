# Memos Bot

Telegram bot for [memos](https://github.com/usememos/memos)

메모를 편하게 하기 위한 봇

# environments

.env 파일의 값 설명

| key                       | 설명                                                  | 예시                      |
| ------------------------- | ----------------------------------------------------- | ------------------------- |
| `BOT_API_TOKEN`           | 텔레그램 봇 토큰                                      |                           |
| `MEMO_URL`                | memos app URL                                         | https://memos.example.com |
| `OPEN_API_TOKEN`          | memos 사용자 계정 open api token (설정에서 확인 가능) |                           |
| `ADMIN_TELEGRAM_USERNAME` | 관리자 username                                       | admin                     |
| `ADMIN_TELEGRAM_DESC`     | 관리자 설명                                           | admin                     |
| `ADMIN_TELEGRAM_CHATID`   | 관리자 chat id                                        | 1122335                   |
| `DELETE_ORI_MSG`          | 사용자가 보낸 메세지 삭제 여부                        | yes or no or empty        |
| `BOT_LANG`                | 언어 설정                                             | ko or en                  |
| `PUID`                    | host UID (`id -u`로 확인)                             | 1000                      |
| `PGID`                    | host GID (`id -g`로 확인)                             | 1000                      |

# 설치

> docker, docker-compose는 기본적으로 설치하셔야 합니다.

- `git clone https://github.com/yellowgg2/memos.git`
- `.env` 파일의 값을 본인에 맞게 설정
- `docker-compose up -d --build` 실행

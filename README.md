[한글](README.ko.md)

# Memos Bot

Telegram bot for [memos](https://github.com/usememos/memos)

To easily use [memos](https://github.com/usememos/memos) app.

# environments

`.env` variables you need to set before installing it

| key                       | 설명                                                                                                              | 예시                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `BOT_API_TOKEN`           | Bot Api Token. This can be obtained with [Bot Father](https://t.me/botfather) in Telegram                         |                           |
| `MEMO_URL`                | memos app URL                                                                                                     | https://memos.example.com |
| `OPEN_API_TOKEN`          | memos user's open api token. You can get this from settings                                                       |                           |
| `ADMIN_TELEGRAM_USERNAME` | admin username (This is your telegram ID)                                                                         | admin                     |
| `ADMIN_TELEGRAM_DESC`     | admin description (optional)                                                                                      | admin                     |
| `ADMIN_TELEGRAM_CHATID`   | admin chat id (This is chat id that you would like to receive vary warning message)                               | 1122335                   |
| `DELETE_ORI_MSG`          | If you want to delete sent message from telegram automatically, then set to `yes`, otherwise set to `no` or empty | yes or no or empty        |
| `BOT_LANG`                | language (`ko` for korean, `en` for english)                                                                      | ko or en                  |
| `PUID`                    | host UID (get it with `id -u` from host)                                                                          | 1000                      |
| `PGID`                    | host GID (get it with `id -g` from host)                                                                          | 1000                      |

# Installation

- Create a bot for memos from [Bot Father](https://t.me/botfather) and get a token
- Clone with `git clone https://github.com/yellowgg2/memos.git`
- Fill out your `.env` file
- Run `docker-compose up -d --build`

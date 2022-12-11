import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

export const ADMIN_TELEGRAM_CHATID = process.env.ADMIN_TELEGRAM_CHATID
  ? parseInt(process.env.ADMIN_TELEGRAM_CHATID)
  : 11111111;

export interface DynamicObject {
  [key: string]: any;
}

let botToken = process.env.BOT_API_TOKEN;

if (!botToken) {
  console.log("========================= NO TOKEN");
  process.exit(1);
} else {
  console.log("You have memos token!");
}

export const botInstance = new TelegramBot(botToken!, {
  polling: true
});

import TelegramBot from "node-telegram-bot-api";
import { botInstance } from "../../global-bot-config";
import { glog } from "../logger/custom-logger";

// inline button을 눌렀을 때 발생하는 이벤트를 처리하는 클래스
export default class AnswerCallbackResponder {
  constructor(private _query: TelegramBot.CallbackQuery) {}

  async start() {
    botInstance
      .answerCallbackQuery(this._query.id)
      .then(async () => {
        let chatId = this._query.message?.chat.id;
        let text = this._query.message?.text;
        let username = this._query.from.username;
        let data = this._query.data;
      })
      .catch(error =>
        glog.error(`[Line - 29][File - AnswerCallbackResponder.ts] ${error}`)
      );
  }

  clearOutButtons(msg: TelegramBot.CallbackQuery) {
    botInstance.editMessageReplyMarkup(
      { inline_keyboard: [] },
      {
        chat_id: msg.from?.id,
        message_id: msg.message?.message_id
      }
    );
  }
}

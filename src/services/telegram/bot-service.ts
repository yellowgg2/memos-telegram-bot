import TelegramBot, { SendMessageOptions } from "node-telegram-bot-api";
// import {
//   InlineKeyboard,
//   InlineKeyboardButton,
//   Row
// } from "node-telegram-keyboard-wrapper";
import { ADMIN_TELEGRAM_CHATID, botInstance } from "../../global-bot-config";
import ApiCaller from "../axios/api-caller";
import { glog } from "../logger/custom-logger";
import DbHandler from "../sqlite/db-handler";
import { LF } from "../../language/language-factory";
import AnswerCallbackResponder from "./answer-callback-responder";

enum CheckReplyForEdit {
  StopProcessing = 1,
  KeepProcessing
}

export default class BotService {
  private static instance: BotService;

  private constructor() {}

  static getInstance() {
    if (!BotService.instance) {
      BotService.instance = new BotService();
    }

    return BotService.instance;
  }

  start() {
    botInstance.on("message", this._messageHandler);
    botInstance.on("polling_error", err => console.log(err));
    botInstance.on("callback_query", async msg => {
      let responder = new AnswerCallbackResponder(msg);
      responder.start();
    });
  }

  showHelp(chatId: number) {
    this.sendMsg(chatId, LF.str.showHelp);
  }

  showAdminHelp(chatId: number) {
    this.sendMsg(chatId, LF.str.showAdminHelp);
  }

  sendMsg(
    chatId: number,
    msg: string,
    options: SendMessageOptions = { parse_mode: "HTML" }
  ): Promise<TelegramBot.Message | null> {
    return botInstance.sendMessage(chatId, msg, options).catch(e => {
      glog.error(`[Line - 55][File - bot-service.ts] ${e}`);
      return null;
    });
  }

  sendMsgToAdmin(msg: string): void {
    botInstance.sendMessage(ADMIN_TELEGRAM_CHATID, LF.str.warningFromBot(msg), {
      parse_mode: "HTML"
    });
  }

  async checkAuthUser(username?: string): Promise<void> {
    if (!username) {
      this.sendMsgToAdmin(LF.str.unauthorizedUserComesIn("Unknown"));
      throw "whoisthis";
    }
    let auth = await DbHandler.isExistingUsername(username);
    if (auth) {
      return;
    } else {
      this.sendMsgToAdmin(LF.str.unauthorizedUserComesIn(username));
      throw "no-auth";
    }
  }

  addUser(
    chatId: number,
    id: string | undefined,
    name: string | undefined,
    type: string = "user",
    token: string = ""
  ) {
    if (!id || !name) {
      this.sendMsg(chatId, LF.str.howToAddUser);
      return;
    }
    this.sendMsgToAdmin(LF.str.newlyAddUserAdminCmd(id, name));
    DbHandler.insertNewUser(id, name, token, type)
      .then(() => this.sendMsg(chatId, LF.str.successfullyAdded))
      .catch(e => glog.error(`[Line - 94][File - bot-service.ts] ${e}`));
  }

  upUser(
    chatId: number,
    id: string | undefined,
    name: string | undefined,
    type: string = "user",
    token: string = ""
  ) {
    if (!id || !name) {
      this.sendMsg(chatId, LF.str.howToUpUser);
      return;
    }
    this.sendMsgToAdmin(LF.str.updateUserAdminCmd(id, name));
    DbHandler.updateUser(id, name, token, type)
      .then(() => this.sendMsg(chatId, LF.str.successfullyUpdated))
      .catch(e => glog.error(`[Line - 111][File - bot-service.ts] ${e}`));
  }

  delUser(chatId: number, id: string | undefined) {
    if (!id) {
      this.sendMsg(chatId, LF.str.howToDelUser);
      return;
    }
    this.sendMsgToAdmin(LF.str.deleteUserAdminCmd(id));
    DbHandler.deleteUser(id)
      .then(() => this.sendMsg(chatId, LF.str.successfullyDeleted))
      .catch(e => glog.error(`[Line - 122][File - bot-service.ts] ${e}`));
  }

  showAllUsers(chatId: number) {
    DbHandler.getAllUsers().then(users => {
      let allUsers = `${LF.str.allowedUsers}\n\n`;
      for (let user of users) {
        allUsers += `🎫 ${user.username}\n`;
        allUsers += `🤶 ${user.first_name}\n`;
        allUsers += `---------------------\n`;
      }
      this.sendMsg(chatId, allUsers);
    });
  }

  startBot(chatId: number) {
    this.sendMsg(chatId, LF.str.welcomeMessage);
  }

  authUserCommand(
    chatId: number,
    username: string | undefined,
    callback: () => any
  ) {
    if (!username) {
      this.sendMsg(chatId, LF.str.noAuthUserWarnMsg);
      return;
    }
    this.checkAuthUser(username)
      .then(() => {
        callback();
      })
      .catch(e => this.sendMsg(chatId, LF.str.noAuthUserWarnMsg));
  }

  adminCommand(
    chatId: number,
    username: string | undefined,
    callback: () => any
  ) {
    if (!username) {
      return;
    }
    DbHandler.isAdminUser(username)
      .then(async admin => {
        if (admin) {
          callback();
        } else {
          this.sendMsg(chatId, LF.str.notAdminWarn);
        }
      })
      .catch(e => glog.error(`[Line - 173][File - bot-service.ts] ${e}`));
  }

  private _messageHandler = (msg: TelegramBot.Message): void => {
    const chatId = msg.chat.id;
    const username = msg.from?.username;

    if (msg.entities && msg.entities[0].type === "bot_command") {
      const cmd = msg.text?.split(" ") ?? [""];
      switch (true) {
        // ----------------------------------- 게스트 메뉴
        case /\/help/.test(cmd[0]):
          this.showHelp(chatId);
          break;
        case /\/start/.test(cmd[0]):
          this.startBot(chatId);
          break;
        case /\/allusers/.test(cmd[0]):
          this.showAllUsers(chatId);
          break;
        // ----------------------------------- 수퍼관리자 메뉴
        case /\/ahelp/.test(cmd[0]):
          this.adminCommand(chatId, username, () => {
            this.showAdminHelp(chatId);
          });
          break;
        case /\/adduser/.test(cmd[0]):
          this.adminCommand(chatId, username, () => {
            this.addUser(chatId, cmd[1], cmd[2], cmd[3], cmd[4]);
          });
          break;
        case /\/upuser/.test(cmd[0]):
          this.adminCommand(chatId, username, () => {
            this.upUser(chatId, cmd[1], cmd[2], cmd[3], cmd[4]);
          });
          break;
        case /\/deluser/.test(cmd[0]):
          this.adminCommand(chatId, username, () => {
            this.delUser(chatId, cmd[1]);
          });
          break;
        default:
          console.log(`${username} - ${msg.text}`);
          break;
      }
      return;
    } else {
      this.authUserCommand(chatId, username, async () => {
        let userToken = await DbHandler.getTokenForUser(username!);
        let token = userToken?.[0]?.token ?? null;
        let memoText = msg.text ?? "";

        if (token && memoText.length > 0) {
          ApiCaller.getInstance()
            .createMemo(userToken?.[0]?.token, memoText)
            .then(() => {
              this.sendMsg(chatId, "😋 Successfully save memo");
              let deleteMsg = process.env.DELETE_ORI_MSG ?? "";
              if (deleteMsg.toUpperCase() === "YES") {
                botInstance.deleteMessage(chatId, `${msg.message_id}`);
              }
            })
            .catch(e => {
              this.sendMsg(chatId, `${e}`);
              glog.error(`[Line - 227][File - bot-service.ts] ${e}`);
            });
        }
      });
    }
  };
}

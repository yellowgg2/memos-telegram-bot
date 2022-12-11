import EnglishBot from "./english";
import KoreanBot from "./korean";

require("dotenv").config();

export interface ILanguageBot {
  showHelp: string;
  showAdminHelp: string;
  warningFromBot(msg: string): string;
  unauthorizedUserComesIn(username: string): string;
  howToAddUser: string;
  newlyAddUserAdminCmd(id: string, desc: string): string;
  successfullyAdded: string;
  howToUpUser: string;
  successfullyUpdated: string;
  updateUserAdminCmd(id: string, desc: string): string;
  howToDelUser: string;
  successfullyDeleted: string;
  deleteUserAdminCmd(id: string): string;
  allowedUsers: string;
  welcomeMessage: string;
  noAuthUserWarnMsg: string;
  notAdminWarn: string;
  notACmd: string;
  showDefaultFileTypes(username: string): string;
  thisIsNotURL: string;
  successfullyAddType(type: string): string;
  successfullyDelType(type: string): string;
}

export class LanguageFactory {
  private static instance: LanguageFactory;
  private _lang = process.env.BOT_LANG ?? "ko";
  private _str: ILanguageBot;

  public set lang(lang: string) {
    this._lang = lang;
    this._str = this._getLanguageInstance();
  }

  public get lang(): string {
    return this._lang;
  }

  public get str(): ILanguageBot {
    return this._str;
  }

  private constructor() {
    this._str = this._getLanguageInstance();
  }

  static getInstance() {
    if (!LanguageFactory.instance) {
      LanguageFactory.instance = new LanguageFactory();
    }

    return LanguageFactory.instance;
  }

  private _getLanguageInstance(): ILanguageBot {
    switch (this._lang) {
      case "ko":
        return new KoreanBot();
      case "en":
        return new EnglishBot();
      default:
        return new KoreanBot();
    }
  }
}

export let LF = LanguageFactory.getInstance();

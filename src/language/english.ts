import { ILanguageBot } from "./language-factory";

export default class EnglishBot implements ILanguageBot {
  howToAddUser =
    "🌈 HowTo : /adduser [id] [desc] [memo api token] [admin/user]";
  successfullyAdded = "🌈 Successfully [[ Added ]]";
  howToUpUser = "🌈 HowTo : /upuser [id] [desc] [memo api token] [admin/user]";
  successfullyUpdated = "🌈 Successfully [[ Updated ]]";
  howToDelUser = "🌈 HowTo : /deluser [id]";
  successfullyDeleted = "🌈 Successfully [[ Deleted ]]";
  allowedUsers = "⚠ Allowed Users List";
  welcomeMessage = "Welcome to Memo bot. Ask Admin to grant access";
  noAuthUserWarnMsg = "🌼 You don't have permission.\nAsk Admin.";
  notAdminWarn = "👿 You are not Admin";
  notACmd = "😥 There is no cmd like this.";
  thisIsNotURL = "👿 This is not URL!";

  successfullyAddType(type: string): string {
    return `${this.successfullyAdded} [${type}]`;
  }

  successfullyDelType(type: string): string {
    return `${this.successfullyDeleted} [${type}]`;
  }

  newlyAddUserAdminCmd(id: string, desc: string): string {
    return `Admin Warning: User newly added ${id} - ${desc}`;
  }

  updateUserAdminCmd(id: string, desc: string): string {
    return `Admin Warning: User updated ${id} - ${desc}`;
  }

  deleteUserAdminCmd(id: string): string {
    return `Admin Warning: User deleted ${id}`;
  }

  unauthorizedUserComesIn(username: string): string {
    return `NoAuth User [${username}] tries to use the bot.`;
  }

  warningFromBot(msg: string): string {
    return `WARNING :\n${msg}`;
  }

  public get showHelp(): string {
    let helpMsg = "/help - Show help menu\n";
    helpMsg += "/allusers - Show all users registered\n";

    return helpMsg;
  }

  public get showAdminHelp(): string {
    let helpMsg = "/adduser - Add User\n";
    helpMsg += "/upuser - Update User\n";
    helpMsg += "/deluser - Delete User\n";

    return helpMsg;
  }

  showDefaultFileTypes(username: string): string {
    return `😍 Default file types for [${username}]\n\n`;
  }
}

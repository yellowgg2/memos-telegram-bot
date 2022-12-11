import { LF } from "../../language/language-factory";
import DbService from "./db-service";

interface IBookmarkUsers {
  username: string;
  first_name: string;
  token: string;
  type: string;
}

export default class DbHandler {
  static async insertNewUser(
    username: string,
    firstName: string,
    token: string, // memos open api token
    type: string = "user"
  ): Promise<void> {
    if (!(await DbHandler.isExistingUsername(username))) {
      await DbService.getInstance().writeQuery(
        "INSERT INTO users(username, first_name, type, token) VALUES (?, ?, ?, ?)",
        [username, firstName, type, token]
      );
    }
  }

  static async updateUser(
    username: string,
    firstName: string,
    token: string,
    type: string = "user"
  ): Promise<void> {
    if (await DbHandler.isExistingUsername(username)) {
      await DbService.getInstance().writeQuery(
        `UPDATE users SET first_name='${firstName}',type='${type}', token='${token}' WHERE username='${username}'`
      );
    } else {
      throw "Nothing to update";
    }
  }

  static async getTokenForUser(username: string): Promise<any> {
    let result = await DbService.getInstance().selectQuery(
      `SELECT token FROM users WHERE username = '${username}' LIMIT 1;`
    );

    return result;
  }

  static async deleteUser(username: string): Promise<void> {
    await DbService.getInstance().writeQuery(
      `DELETE FROM users where username = '${username}'`
    );
  }

  static async deleteAllUser(): Promise<void> {
    await DbService.getInstance().writeQuery(`DELETE FROM users`);
  }

  static async isExistingUsername(username: string): Promise<boolean> {
    let result: Array<IBookmarkUsers> =
      await DbService.getInstance().selectQuery(
        `SELECT * FROM users WHERE username = '${username}'`
      );

    return result.length !== 0;
  }

  static async isAdminUser(username: string): Promise<boolean> {
    let result: Array<IBookmarkUsers> =
      await DbService.getInstance().selectQuery(
        `SELECT * FROM users WHERE username = '${username}' AND type='admin'`
      );

    return result.length !== 0;
  }

  static async getAllUsers(): Promise<Array<IBookmarkUsers>> {
    let result: Array<IBookmarkUsers> =
      await DbService.getInstance().selectQuery(`SELECT * FROM users`);
    return result;
  }

  static async initAuthorizedUsers(): Promise<void> {
    // await DbHandler.deleteAllUser();
    await DbHandler.insertNewUser(
      process.env.ADMIN_TELEGRAM_USERNAME ?? "admin",
      process.env.ADMIN_TELEGRAM_DESC ?? "admin",
      process.env.OPEN_API_TOKEN ?? "",
      "admin"
    );
  }
}

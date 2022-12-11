if (process.env.NODE_ENV === "development") {
  require("custom-env").env("dev");
}

function checkEnvs() {
  if (
    process.env.ADMIN_TELEGRAM_USERNAME &&
    process.env.BOT_API_TOKEN &&
    process.env.MEMO_URL &&
    process.env.OPEN_API_TOKEN
  ) {
    return;
  }
  console.error("There are missing env variable. check the .env file");
  process.exit(1);
}

checkEnvs();

import { glog } from "./services/logger/custom-logger";
import DbHandler from "./services/sqlite/db-handler";
import DbService from "./services/sqlite/db-service";
import BotService from "./services/telegram/bot-service";

class Starter {
  startServer = async () => {
    await DbService.getInstance()
      .createTable()
      .catch(e => glog.error(`[Line - 14][File - app.ts] ${e}`));

    DbHandler.initAuthorizedUsers().catch(e =>
      glog.error(`[Line - 16][File - app.ts] ${e}`)
    );

    BotService.getInstance().start();

    process.on("SIGINT", () => {
      process.exit(0);
    });
  };

  startDevServer = async () => {};
}

new Starter().startServer();

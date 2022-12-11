import axios from "axios";
import { glog } from "../logger/custom-logger";
require("dotenv").config();

export default class ApiCaller {
  private static instance: ApiCaller;
  private _baseUrl = process.env.MEMO_URL;
  private _apiSubUrlWithToken = "api/memo?openId";

  private constructor() {}

  static getInstance() {
    if (!ApiCaller.instance) {
      ApiCaller.instance = new ApiCaller();
    }

    return ApiCaller.instance;
  }

  async createMemo(memosToken: string, content: string) {
    let res = await axios.post(
      `${this._baseUrl}/${this._apiSubUrlWithToken}=${memosToken}`,
      {
        content
      }
    );

    if (res.status >= 400) {
      glog.error(`[Line - 74][File - api-caller.ts] ${res.statusText}`);
      throw res.statusText;
    }
  }
}

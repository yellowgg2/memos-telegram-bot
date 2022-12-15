import axios from "axios";
import { glog } from "../logger/custom-logger";
import fs from "fs";

export default class ApiCaller {
  private static instance: ApiCaller;
  private _baseUrl = process.env.MEMO_URL;
  private _apiSubUrlWithToken = "api/memo?openId";
  private _apiResourceSubUrlWithToken = "api/resource?openId";

  private constructor() {}

  static getInstance() {
    if (!ApiCaller.instance) {
      ApiCaller.instance = new ApiCaller();
    }

    return ApiCaller.instance;
  }

  async createMemo(
    memosToken: string,
    content: string,
    resourceIdList: Array<number> = []
  ) {
    let res = await axios.post(
      `${this._baseUrl}/${this._apiSubUrlWithToken}=${memosToken}`,
      {
        content,
        resourceIdList
      }
    );

    if (res.status >= 400) {
      glog.error(`[Line - 74][File - api-caller.ts] ${res.statusText}`);
      throw res.statusText;
    }
  }

  async createResource(memosToken: string, filename: string): Promise<number> {
    const FormData = require("form-data"); // npm install --save form-data

    const form = new FormData();
    form.append("file", fs.createReadStream(filename));
    let res = await axios.post(
      `${this._baseUrl}/${this._apiResourceSubUrlWithToken}=${memosToken}`,
      form
    );

    if (res.status >= 400) {
      glog.error(`[Line - 74][File - api-caller.ts] ${res.statusText}`);
      throw res.statusText;
    }

    fs.unlinkSync(filename);
    return res.data.data.id;
  }
}

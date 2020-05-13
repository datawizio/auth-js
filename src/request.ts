import { ILocationParams } from "./types";

class Request {
  baseUrl = "";

  buildUrl(path: string, params?: ILocationParams) {
    let url = this.baseUrl + path;
    if (params) {
      let array: Array<string> = [];
      Object.keys(params).forEach(key => {
        array.push(`${key}=${params[key]}`);
      });
      url += "?" + array.join("&");
    }
    return url;
  }

  async post(url: string, data: ILocationParams = {}, isJson: boolean = true) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    const response = await fetch(this.buildUrl(url), {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      referrerPolicy: "no-referrer",
      body: formData
    });
    if (isJson) return await response.json();

    return response;
  }
}

export default new Request();

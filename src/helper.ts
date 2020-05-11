import { ILocationParams } from "./types";

export function getUrlParams() {
  const result: ILocationParams = {};
  const params = location.search.substr(1).split("&");
  params.forEach(param => {
    const [key, value] = param.split("=");
    result[key] = value;
  });

  return result;
}

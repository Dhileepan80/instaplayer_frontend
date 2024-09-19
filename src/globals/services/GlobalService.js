import RestDataSource from "../utils/RestDataSource";

export default class GlobalService {
  static generalSelect(callbackFn = () => {}, url, method, data = {}, apiCancelation = true) {
    RestDataSource.sendRequest((res) => {
      console.log('res in global ser', res);
      callbackFn(res?.data || {});
    }, url, method, data, apiCancelation);
  }
}
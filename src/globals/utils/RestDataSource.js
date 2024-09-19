import Axios from 'axios';
import { apiKey, restBaseUrl } from './constants';
import { setApiCancelTokens, setRequestToken } from '.';

export default class RestDataSource {
  static async sendRequest(callback = () => {}, url, method, data = {}, apiCancelation = true) {
    const req = Axios.request({
      url,
      method,
      baseURL: restBaseUrl,
      data,
      withCredentials: false,
      params: {
        api_key: apiKey,
      },
      cancelToken: new Axios.CancelToken((cancelFn) => {
      }),
    });

    try {
      const res = await req;

      if (url.search('token/new') !== -1) {
        setRequestToken(res.data.request_token);
      }
      console.log('res in rsd', res)
      callback(res);
    } catch(err) {
      console.log('api cal', err)
      callback(err.response);
    }
  }
}
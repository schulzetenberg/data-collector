import axios from 'axios';

const Request = {
  get: ({ url }: { url: string }): Promise<ServerResponse> => {
    return axios.get(url).then((x) => x.data);
  },

  post: ({ url, body = {} }: { url: string; body?: object }): Promise<ServerResponse> => {
    return axios.post(url, body).then((x) => x.data);
  },
};

export default Request;

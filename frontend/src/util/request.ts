import axios from 'axios';

const Request = {
  get: ({ url }: { url: string }): Promise<ServerResponse> => {
    return axios.get(url).then((x) => x.data);
  },

  post: ({ url, body = {} }: { url: string; body?: object }): Promise<ServerResponse> => {
    return axios
      .post(url, body)
      .then((response) => {
        if (response.data.errors) return Promise.reject({ data: { error: response.data.errors } });
        return response.data;
      })
      .catch((err) => {
        const serverResponse = err.data.error;
        let errors = [];

        if (Array.isArray(serverResponse)) {
          errors = serverResponse.map((error: ResponseValidationError) => error.msg);
        } else {
          errors = [serverResponse];
        }

        return { errors, status: err.status, statusText: err.statusText };
      });
  },
};

export default Request;

const Request = {
  get: ({ url }: { url: string }): Promise<ServerResponse> => {
    return fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response: any) => {
        if (response.status === 401) {
          // TODO: Clear cookies
        } else if (!response.ok && response.status !== 304) {
          return Promise.reject(response);
        }

        return response;
      })
      .then((res) => res.json());
  },

  post: ({ url, body = {} }: { url: string; body?: object }): Promise<ServerResponse> => {
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  },
};

export default Request;

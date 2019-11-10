const Request = {
	get: ({ url }: { url: string }) => {
		return fetch(url, {
		method: 'GET',
		headers:{
			'Content-Type': 'application/json'
		 }
		}).then(res => res.json());
	},

	post: ({ url, body }: { url: string, body: Object }) => {
		return fetch(url, {
		method: 'POST',
		body: JSON.stringify(body),
		headers:{
			'Content-Type': 'application/json'
		 }
		}).then(res => res.json());
	},
}

export default Request;
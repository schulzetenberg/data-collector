interface ResponseSuccess {
  message: string;
  error: string;
  data: any;
}

interface ReponseError {
  errors: string[];
}

interface ServerResponse extends ResponseSuccess, ReponseError {}

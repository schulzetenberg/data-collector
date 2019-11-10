interface ResponseSuccess {
  message: string;
  error: string;
  data: any;
}

interface ReponseError {
  error: string;
}

interface ResponseValidationError {
  error: {
    location: string;
    msg: string;
    param: string;
    value: string;
  }[];
}

interface ServerResponse extends ResponseSuccess, ReponseError, ResponseValidationError {}

interface ResponseSuccess {
  message: string;
  error: string;
  data: any;
}

interface ReponseError {
  errors: string[];
}

interface ResponseValidationError {
  location: string;
  msg: string;
  param: string;
  value: string;
}

interface ServerResponse extends ResponseSuccess, ReponseError {}

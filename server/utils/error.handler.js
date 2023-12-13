const errorMap = {
  invalidPath: { code: 404, message: "Resource not found" },
  incompleteData: {
    code: 500,
    message: "Data sent was not enough for this request",
  },
  invalidData: { code: 500, message: "Invalid data passed with request" },
  existingUser: { code: 400, message: "User already exist please login" },
  serverError: { code: 500, message: "Something went wrong" },
  missingSocket: { code: 400, message: "Socket info missing" },
  expiredToken: { code: 400, message: "Token has expired please login again" },
};

class ServerError extends Error {
  constructor(code, type, message) {
    super(message);
    this.status = "fail";
    this.code = code;
    this.type = type;
  }

  static from({ code, type, message }) {
    return new ServerError(code, type, message);
  }

  static getDefinedError(type = "serverError") {
    return this.from({
      ...errorMap[type],
      type,
    });
  }
}

const sendErrorResponse = (error, next) => {
  if (!error.type) {
    error.type = "serverError";
    error.code = 500;
  }
  next(error);
};

module.exports = { sendErrorResponse, ServerError };

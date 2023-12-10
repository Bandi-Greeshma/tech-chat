const errorMap = {
  incompleteData: {
    status: 500,
    message: "Data sent was not enough for this request",
  },
  invalidData: { status: 500, message: "Invalid data passed with request" },
  existingUser: { status: 400, message: "User already exist please login" },
  serverError: { status: 500, message: "Something went wrong" },
  missingSocket: { status: 400, message: "Socket info missing" },
};

const sendErrorResponse = (error, next) => {
  const type = error.type ? error.type : "serverError";
  type === "serverError" && console.log(error);
  next({
    type,
    ...errorMap[type],
  });
};

module.exports = { sendErrorResponse };

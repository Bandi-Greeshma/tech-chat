const errorMap = {
  incompleteData: {
    staus: 400,
    message: "Data sent was not enough for this request",
  },
  existingUser: { status: 400, message: "User already exist please login" },
  default: { status: 500, message: "Something went wrong" },
};

const sendErrorResponse = (error, next) => {
  const type = error.type ? error.type : "default";
  type === "default" && console.log(error);
  next({
    type,
    ...errorMap[type],
  });
};

module.exports = { sendErrorResponse };

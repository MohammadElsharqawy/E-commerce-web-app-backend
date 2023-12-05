// @desc    this class is responsible for operational errors (errors i can predict)
class ApiError extends Error {
  //Error nfso kan bya7`d message, yb2a nb3t ll super ell message.
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; //means that i can predict the error.
  }
}

module.exports = ApiError;

const catchError = handler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

module.exports = catchError;

//This is a wrapper function around the async middleware. 
//The handler is an async middleware.
//The function returns a new middleware:
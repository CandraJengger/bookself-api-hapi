const responseFail = (h, message) =>
  h
    .response({
      status: 'fail',
      message,
    })
    .code(400);

const responseError = (h, message) =>
  h
    .response({
      status: 'error',
      message,
    })
    .code(500);

const responseSuccess = (h, message, data) =>
  h
    .response({
      status: 'success',
      message,
      data,
    })
    .code(201);

module.exports = { responseFail, responseError, responseSuccess };

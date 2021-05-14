const responseFail = ({ h, message = '', code = 400 }) =>
  h
    .response({
      status: 'fail',
      message,
    })
    .code(code);

const responseError = ({ h, message = '', code = 500 }) =>
  h
    .response({
      status: 'error',
      message,
    })
    .code(code);

const responseSuccess = ({ h, message = '', data = [], code = 200 }) =>
  h
    .response({
      status: 'success',
      message,
      data,
    })
    .code(code);

const responseSuccessWithoutMessage = ({ h, data = [], code = 201 }) =>
  h
    .response({
      status: 'success',
      data,
    })
    .code(code);

module.exports = {
  responseFail,
  responseError,
  responseSuccess,
  responseSuccessWithoutMessage,
};

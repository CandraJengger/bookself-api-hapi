const { addBookHandler } = require('../services');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
];

module.exports = routes;

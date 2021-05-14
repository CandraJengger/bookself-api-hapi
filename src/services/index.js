const { nanoid } = require('nanoid');
const books = require('../data/books');
const {
  responseError,
  responseFail,
  responseSuccess,
  responseSuccessWithoutMessage,
} = require('../utils/response-utils');

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    return responseFail({
      h,
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
      code: 400,
    });
  }

  if (readPage > pageCount) {
    return responseFail({
      h,
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      code: 400,
    });
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((note) => note.id === newBook.id).length > 0;

  if (isSuccess) {
    return responseSuccess({
      h,
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
      code: 201,
    });
  }

  return responseError({ h, message: 'Buku gagal ditambahkan', code: 500 });
};

const getAllBooksHandler = (req, h) => {
  if (books.length === 0) {
    return responseSuccessWithoutMessage({
      h,
      data: {
        books: [],
      },
      code: 200,
    });
  }

  return responseSuccessWithoutMessage({ h, data: books, code: 200 });
};

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const bookOfId = books.filter((book) => book.id === bookId)[0];

  if (bookOfId === undefined) {
    return responseFail({ h, message: 'Buku tidak ditemukan', code: 404 });
  }

  return responseSuccessWithoutMessage({ h, data: bookOfId, code: 200 });
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler };

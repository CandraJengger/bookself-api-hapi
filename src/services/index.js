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
    return responseFail(h, 'Gagal menambahkan buku. Mohon isi nama buku');
  }

  if (readPage > pageCount) {
    return responseFail(
      h,
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    );
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
    return responseSuccess(h, 'Buku berhasil ditambahkan', {
      bookId: id,
    });
  }

  return responseError(h, 'Buku gagal ditambahkan');
};

const getAllBooksHandler = (req, h) => {
  if (books.length === 0) {
    return responseSuccessWithoutMessage(h, {
      books: [],
    });
  }

  return responseSuccessWithoutMessage(h, books);
};

module.exports = { addBookHandler, getAllBooksHandler };

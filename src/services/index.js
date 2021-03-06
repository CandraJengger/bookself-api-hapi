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
  const { name, reading, finished } = req.query;

  if (books.length === 0) {
    return responseSuccessWithoutMessage({
      h,
      data: {
        books: [],
      },
      code: 200,
    });
  }

  const newFormatBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  // Search book with query name
  if (name !== undefined) {
    const resultBook = books
      .filter((book) => book.name.toLowerCase() === name.toLowerCase())
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

    if (resultBook.length === 0) {
      return responseFail({ h, message: 'Buku tidak ditemukan', code: 404 });
    }

    return responseSuccessWithoutMessage({
      h,
      data: {
        books: resultBook,
      },
      code: 200,
    });
  }

  // Search book with query reading
  if (reading !== undefined && reading === '1') {
    const booksRead = books
      .filter((book) => book.reading)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    return responseSuccessWithoutMessage({
      h,
      data: {
        books: booksRead,
      },
      code: 200,
    });
  }

  if (reading !== undefined && reading === '0') {
    const unreadBooks = books
      .filter((book) => !book.reading)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    return responseSuccessWithoutMessage({
      h,
      data: {
        books: unreadBooks,
      },
      code: 200,
    });
  }

  if (reading !== undefined) {
    return responseSuccessWithoutMessage({
      h,
      data: {
        books: newFormatBooks,
      },
      code: 200,
    });
  }

  // Search book with query finished
  if (finished !== undefined && finished === '1') {
    const finishedBooks = books
      .filter((book) => book.finished)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    return responseSuccessWithoutMessage({
      h,
      data: {
        books: finishedBooks,
      },
      code: 200,
    });
  }

  if (finished !== undefined && finished === '0') {
    const unfinishedBooks = books
      .filter((book) => !book.finished)
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    return responseSuccessWithoutMessage({
      h,
      data: {
        books: unfinishedBooks,
      },
      code: 200,
    });
  }

  if (finished !== undefined) {
    return responseSuccessWithoutMessage({
      h,
      data: {
        books: newFormatBooks,
      },
      code: 200,
    });
  }

  return responseSuccessWithoutMessage({
    h,
    data: {
      books: newFormatBooks,
    },
    code: 200,
  });
};

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const bookOfId = books.filter((book) => book.id === bookId)[0];

  if (bookOfId === undefined) {
    return responseFail({ h, message: 'Buku tidak ditemukan', code: 404 });
  }

  return responseSuccessWithoutMessage({
    h,
    data: {
      book: bookOfId,
    },
    code: 200,
  });
};

const editBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
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

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    return responseFail({
      h,
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
      code: 400,
    });
  }

  if (readPage > pageCount) {
    return responseFail({
      h,
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      code: 400,
    });
  }

  if (index === -1) {
    return responseFail({
      h,
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
      code: 404,
    });
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  return responseSuccess({ h, message: 'Buku berhasil diperbarui', code: 200 });
};

const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return responseFail({
      h,
      message: 'Buku gagal dihapus. Id tidak ditemukan',
      code: 404,
    });
  }

  books.splice(index, 1);
  return responseSuccess({ h, message: 'Buku berhasil dihapus', code: 200 });
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};

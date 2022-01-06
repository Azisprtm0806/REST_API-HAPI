const { nanoid } = require("nanoid");
const fs = require("fs");
const jsonFile = require("jsonfile");
// const data = require("./Books.json");

const addBooks = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage ? true : false;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const insertedAt = new Date().toISOString();
  const updatedAt = createdAt;

  const book = {
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
    createdAt,
    insertedAt,
    updatedAt,
  };

  console.log(book);

  if (book.name == null) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const data = fs.readFileSync("./src/Books.json");
  const myObject = JSON.parse(data);

  myObject.push(book);

  const newData = JSON.stringify(myObject);
  fs.writeFile("./src/Books.json", newData, (err) => {
    if (err) throw err;
  });

  const NewBook = fs.readFileSync("./src/Books.json");
  const isSuccess = NewBook.filter((book) => book.id === id);

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

// Menampilkan seluruh buku
const getAllBooks = (request, h) => {
  const getBooks = JSON.parse(fs.readFileSync("./src/Books.json"));
  const Books = getBooks.map((book) => {
    const dataBooks = {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
    return dataBooks;
  });
  console.log(Books);
  const response = h.response({
    status: "success",
    data: {
      Books,
    },
  });
  response.code(200);
  return response;
};

// menampilkan detail buku
const getBookDetail = (request, h) => {
  const { id } = request.params;

  const Books = JSON.parse(fs.readFileSync("./src/Books.json"));
  const book = Books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBook = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (name == null) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }
  const Books = JSON.parse(fs.readFileSync("./src/Books.json"));
  const index = Books.findIndex((book) => book.id === id);

  if (index != -1) {
    jsonFile.readFile("./src/Books.json", function (err, data) {
      const fileObj = data;

      fileObj.map((curr) => {
        if (curr.id == id) {
          curr.name = name;
          curr.year = year;
          curr.author = author;
          curr.summary = summary;
          curr.publisher = publisher;
          curr.pageCount = pageCount;
          curr.readPage = readPage;
          curr.reading = reading;
          curr.updatedAt = updatedAt;
        }
      });
      jsonFile.writeFile("./src/Books.json", fileObj, function (err) {
        if (err) throw err;
      });
    });

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBook = (request, h) => {
  const { id } = request.params;

  const Books = JSON.parse(fs.readFileSync("./src/Books.json"));

  const filterBooks = Books.filter((book) => book.id !== id);
  if (Books.length === filterBooks.length) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  saveUserData(filterBooks);

  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};

const saveUserData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("./src/Books.json", stringifyData);
};

module.exports = { addBooks, getAllBooks, getBookDetail, editBook, deleteBook };

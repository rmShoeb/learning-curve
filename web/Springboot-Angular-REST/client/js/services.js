angular
  .module("BookApp.services", [])
  .factory("bookAPIservice", function ($http) {
    let bookAPI = {};

    bookAPI.getBooks = function () {
      return $http({
        method: "GET",
        url: "http://localhost:8080/book",
      });
    };
    bookAPI.SaveBook = function (book) {
      return $http({
        method: "POST",
        url: "http://localhost:8080/book",
        data: {
          title: book.title,
          author: book.author,
        },
      });
    };
    bookAPI.UpdateBook = function (book) {
      return $http({
        method: "PUT",
        url: "http://localhost:8080/book",
        data: {
          id: book.id,
          title: book.title,
          author: book.author,
        },
      });
    };
    bookAPI.getBookById = function (id) {
      return $http({
        method: "GET",
        url: "http://localhost:8080/book/" + id,
      });
    };
    bookAPI.DeleteBook = function (id) {
      return $http({
        method: "DELETE",
        url: "http://localhost:8080/book/" + id,
      });
    };

    return bookAPI;
  });

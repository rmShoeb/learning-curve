angular
    .module("BookApp.services", [])
    .factory("bookAPIservice", function ($http) {
        let bookAPI = {};

        bookAPI.getBooks = function (jwt) {
            return $http({
                method: "GET",
                url: "http://localhost:8080/book",
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },
            });
        };
        bookAPI.SaveBook = function (jwt, book) {
            return $http({
                method: "POST",
                url: "http://localhost:8080/book/new",
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },
                data: {
                    title: book.title,
                    author: book.author,
                },
            });
        };
        bookAPI.UpdateBook = function (jwt, book) {
            return $http({
                method: "PUT",
                url: "http://localhost:8080/book/update",
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },
                data: {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                },
            });
        };
        bookAPI.getBookById = function (jwt, id) {
            return $http({
                method: "GET",
                url: "http://localhost:8080/book/" + id,
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },
            });
        };
        bookAPI.DeleteBook = function (jwt, id) {
            return $http({
                method: "DELETE",
                url: "http://localhost:8080/book/" + id,
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },
            });
        };

        return bookAPI;
    });

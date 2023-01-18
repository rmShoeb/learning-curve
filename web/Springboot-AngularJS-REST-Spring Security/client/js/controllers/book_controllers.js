let book_controllers = angular.module("BookApp.controllers", []);

book_controllers.controller(
    "GetAllBooksController",
    function ($scope, $state, util, bookAPIservice) {
        $scope.books = [];

        bookAPIservice.getBooks(util.getJWT()).then(
            function (response) { // on success
                $scope.books = response.data.sort((a, b) => a.id - b.id);
            },
            function (response) { // on error
                console.log(response);
                $state.go("login");
            }
        );
    }
);

book_controllers.controller(
    "EditUpdateBookController",
    function ($scope, $state, $stateParams, util, bookAPIservice) {
        $scope.book = {};
        if ($stateParams.id) {
            bookAPIservice.getBookById(util.getJWT(), $stateParams.id).then(
                function (response) {
                    $scope.book = response.data;
                },
                function (response) { // error
                    console.log(response);
                    $state.go("login");
                }
            );
        }
        $scope.SaveUpdateBook = function () {
            if ($scope.book.id) { // this block handles the UPDATE
                bookAPIservice.UpdateBook(util.getJWT(), $scope.book).then(
                    function (response) { // success
                        FormClear();
                        $state.go("books");
                    },
                    function (response) { // error
                        console.log(response);
                        $state.go("login");
                    }
                );
            } else { // this block handles CREATE
                bookAPIservice.SaveBook(util.getJWT(), $scope.book).then(
                    function (response) { // success
                        FormClear();
                        $state.go("books");
                    },
                    function (response) { // error
                        console.log(response);
                        $state.go("login");
                    }
                );
            }
        };
        FormClear = function () {
            $scope.book.title = "";
            $scope.book.author = "";
        };
    }
);

book_controllers.controller(
    "DeleteBookController",
    function ($stateParams, $state, util, bookAPIservice) {
        bookAPIservice.DeleteBook(util.getJWT(), $stateParams.id).then(
            function (response) { // success
                $state.go("books");
            },
            function (response) { // error
                console.log(response);
                $state.go("login");
            }
        );
    }
);

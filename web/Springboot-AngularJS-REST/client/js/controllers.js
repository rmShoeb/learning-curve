let controllers = angular.module("BookApp.controllers", []);

controllers.controller(
    "GetAllBooksController",
    function ($scope, bookAPIservice) {
        $scope.books = [];

        bookAPIservice.getBooks().then(
            function (response) { // on success
                $scope.books = response.data.sort((a, b) => a.id - b.id);
            },
            function (response) { // on error
                console.log(response);
            }
        );
    }
);

controllers.controller(
    "EditUpdateBookController",
    function ($scope, $state, $stateParams, bookAPIservice) {
        $scope.book = {};
        if ($stateParams.id) {
            bookAPIservice.getBookById($stateParams.id).then(
                function (response) {
                    $scope.book = response.data;
                },
                function (response) { // error
                    console.log(response);
                }
            );
        }
        $scope.SaveUpdateBook = function () {
            if ($scope.book.id) {
                bookAPIservice.UpdateBook($scope.book).then(
                    function (response) { // success
                        FormClear();
                        $state.go("books");
                    },
                    function (response) { // error
                        console.log(response);
                    }
                );
            } else {
                bookAPIservice.SaveBook($scope.book).then(
                    function (response) { // success
                        FormClear();
                        $state.go("books");
                    },
                    function (response) { // error
                        console.log(response);
                    }
                );
            }
        };
        FormClear = function () {
            $scope.book.id = null;
            $scope.book.title = "";
            $scope.book.author = "";
        };
    }
);

controllers.controller(
    "DeleteBookController",
    function ($stateParams, $state, bookAPIservice) {
        bookAPIservice.DeleteBook($stateParams.id).then(
            function (response) { // success
                $state.go("books");
            },
            function (response) { // error
                console.log(response);
            }
        );
    }
);

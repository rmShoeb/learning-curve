let app = angular.module('BookApp', [
    'ui.router',
    'BookApp.services',
    'BookApp.controllers',
]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('books', {
            url: '/books',
            templateUrl: "views/books.html",
            controller: "GetAllBooksController"
        })
        .state('EditUpdate', {
            url: '/edit-update',
            params: {
                id: null,
            },
            templateUrl: 'views/book-form.html',
            controller: 'EditUpdateBookController',
        })
        .state('delete', {
            url: '/delete',
            params: {
                id: null,
            },
            // template: 'deleted',
            controller: 'DeleteBookController',
        });
    $urlRouterProvider.otherwise("/books");
});


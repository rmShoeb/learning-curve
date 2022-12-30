let app = angular.module('BookApp', [
    'ui.router',
    'Util',
    'Login.services',
    'BookApp.services',
    'Login.controller',
    'BookApp.controllers',
]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "views/login.html",
            controller: 'LoginController'
        })
        .state('logout', {
            url: '/logout',
            controller: 'LogoutController',
        })
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
    $urlRouterProvider.otherwise("/login");
});


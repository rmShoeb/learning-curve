let app = angular.module('F1FeederApp', [
    'ui.router',
    'F1FeederApp.services',
    'F1FeederApp.controllers',
]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('Drivers', {
            url: '/drivers',
            templateUrl: "views/drivers.html",
            controller: "driversController"
        })
        .state('Driver', {
            // url: '/driver?id',
            url: '/driver',
            params: {
                id: null,
            },
            templateUrl: "views/driver.html",
            controller: "driverController"
        });
    $urlRouterProvider.otherwise("/drivers");
});


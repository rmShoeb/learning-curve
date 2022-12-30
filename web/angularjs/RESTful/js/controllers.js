let controllers = angular.module('F1FeederApp.controllers', []);

controllers.controller('driversController', function ($scope, ergastAPIservice) {
    $scope.nameFilter = null;
    $scope.driversList = [];

    ergastAPIservice.getDrivers().then(
        function (response) { // on success
            $scope.driversList = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        },
        function (response) { // on error
            console.log(response);
        }
    );
});

// controllers.controller('driverController', function ($scope, $routeParams, ergastAPIservice) {
controllers.controller('driverController', function ($scope, $stateParams, ergastAPIservice) {
    $scope.id = $stateParams.id;
    $scope.races = [];
    $scope.driver = null;

    ergastAPIservice.getDriverDetails($scope.id).then(
        function (response) {
            $scope.driver = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
        },
        function (response) { // on error
            console.log(response);
        }
    );
    ergastAPIservice.getDriverRaces($scope.id).then(
        function (response) {
            $scope.races = response.data.MRData.RaceTable.Races;
        },
        function (response) { // on error
            console.log(response);
        }
    );
});
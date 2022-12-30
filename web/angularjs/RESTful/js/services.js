angular.module('F1FeederApp.services', []).factory('ergastAPIservice', function ($http) {
    let ergastAPI = {};

    ergastAPI.getDrivers = function () {
        return $http({
            method: 'GET',
            url: 'https://ergast.com/api/f1/2022/5/driverStandings.json'
        });
    };
    ergastAPI.getDriverDetails = function (id) {
        return $http({
            method: 'GET',
            url: 'http://ergast.com/api/f1/2022/drivers/' + id + '/driverStandings.json'
        });
    };
    ergastAPI.getDriverRaces = function (id) {
        return $http({
            method: 'GET',
            url: 'http://ergast.com/api/f1/2022/drivers/' + id + '/results.json'
        });
    };

    return ergastAPI;
});
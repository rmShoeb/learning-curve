var clockApp = angular.module('clockApp', []);

clockApp.controller('clockTimeCtrl', function ($scope) {
    $scope.time = new Date().toTimeString();

    $scope.UpdateTimeFunc = function () {
        $scope.time = new Date().toTimeString();
    }
});
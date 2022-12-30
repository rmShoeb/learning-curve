let util = angular.module('Util', [])
    .factory("util", function () {
    let utility = {};

    utility.saveJWT = function (jwt) {
        sessionStorage.setItem('token', jwt);
    };
    utility.getJWT = function(){
        return sessionStorage.getItem('token');
    }
    utility.reset = function(){
        sessionStorage.removeItem('token');
    }

    return utility;
});
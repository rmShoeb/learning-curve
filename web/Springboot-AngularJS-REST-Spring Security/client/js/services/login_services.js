angular
    .module("Login.services", [])
    .factory("loginAPIservice", function ($http) {
        let loginAPI = {};

        loginAPI.login = function (userinfo) {
            return $http({
                method: "POST",
                url: "http://localhost:8080/authenticate",
                data: {
                    username: userinfo.username,
                    password: userinfo.password
                },
            });
        };
        loginAPI.logout = function (jwt) {
            return $http({
                method: "POST",
                url: "http://localhost:8080/logout",
                headers: {
                    'Authorization': 'Bearer ' + jwt
                },
            });
        };

        return loginAPI;
    });

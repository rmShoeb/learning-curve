let login_controller = angular.module("Login.controller", []);

login_controller.controller(
    "LoginController",
    function ($scope, $state, util, loginAPIservice) {
        $scope.UserLogin = function(){
            loginAPIservice.login($scope.userinfo).then(
                function (response) { // on success
                    util.saveJWT(response.data.jwt);
                    $state.go("books");
                },
                function (response) { // on error
                    console.log(response);
                    $state.go("login");
                }
            );
        };
    }
);

login_controller.controller(
    "LogoutController",
    function ($state, util, loginAPIservice) {
        loginAPIservice.logout(util.getJWT()).then(
            function (response) { // on success
                util.reset();
                $state.go("login");
            },
            function (response) { // on error
                console.log(response);
                $state.go("login");
            }
        );
    }
);

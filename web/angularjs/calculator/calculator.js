var calculatorApp = angular.module('calculatorApp', []);

calculatorApp.controller('calculatorCtrl', function ($scope) {
    $scope.operand1 = '0';
    $scope.operand2 = '0';
    $scope.operator = '+';
    $scope.answer = '0';

    $scope.SetOperatorFunc = function (operator) {
        $scope.operator = operator;
        $scope.SolveFunc();
    }
    $scope.SolveFunc = function () {
        switch ($scope.operator) {
            case '+':
                $scope.answer = Number($scope.operand1) + Number($scope.operand2);
                break;
            case '-':
                $scope.answer = Number($scope.operand1) - Number($scope.operand2);
                break;
            case 'X':
                $scope.answer = Number($scope.operand1) * Number($scope.operand2);
                break;
            case '/':
                if(Number($scope.operand2) != 0)
                    $scope.answer = Number($scope.operand1) / Number($scope.operand2);
                else
                    $scope.answer = "Cannot divide by zero";
                break;
            default:
                break;
        }
    }
});
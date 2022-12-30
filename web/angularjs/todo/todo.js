angular.module('ToDoApp', []).controller("ToDoCtrl", ToDoController);

function ToDoController() {
    this.tasks = [];

    this.AddNewTaskFunc = function () {
        if (this.new_task) {
            this.tasks.push(this.new_task);
            this.new_task = "";
        }
    };

    this.DeleteTaskFunc = function(index){
        this.tasks.splice(index, 1);
    }
}

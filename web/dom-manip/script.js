// selectors
const form = document.querySelector('form');
const newTask = form.querySelector('#new-task');
const incompleteTasks = document.querySelector('.todo-list #items');
const completeTasks = document.querySelector('.complete-list ul');


// functions
function funcCreateTask(task){
    let listItem = document.createElement('li');
    let checkBox = document.createElement('input');
    let labelForItem = document.createElement('label');

    // set their values and what not
    labelForItem.innerText = task;
    checkBox.type = 'checkbox';
    listItem.appendChild(checkBox);
    listItem.appendChild(labelForItem);

    return listItem;
}

function funcAddTask(event){
    event.preventDefault();
    let newListItem = funcCreateTask(newTask.value);

    incompleteTasks.appendChild(newListItem);
    newTask.value = '';

    bindIncompleteEvents(newListItem, funcCompleteTask);
}

function funcCompleteTask(){
    let listItem = this.parentNode;
    let deleteButton = document.createElement('button');
    let checkBox = listItem.querySelector('input[type="checkbox"]');
    
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete';
    listItem.appendChild(deleteButton);
    checkBox.remove();

    completeTasks.appendChild(listItem);
    bindCompleteEvents(listItem, funcDeleteCompleteTask);
}

function funcDeleteCompleteTask(){
    let listItem = this.parentNode;
    let ul = listItem.parentNode;

    ul.removeChild(listItem);
}

function bindIncompleteEvents(taskItem, checkBoxClickEvent){
    let checkBox = taskItem.querySelector("input[type='checkbox']");
    checkBox.onchange = checkBoxClickEvent;
}

function bindCompleteEvents(taskItem, deleteClickEvent){
    let deleteButton = taskItem.querySelector('.delete');
    deleteButton.onclick = deleteClickEvent;
}


// bind the functions with already existing list items
for(let child of incompleteTasks.children){
    bindIncompleteEvents(child, funcCompleteTask);
}
for(let child of completeTasks.children){
    bindCompleteEvents(child, funcDeleteCompleteTask);
}

// handle new items
form.addEventListener('submit', funcAddTask);
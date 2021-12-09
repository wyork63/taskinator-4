var formEl = document.querySelector ("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks =[];


var completeEditTask = function(taskName, taskType, taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks [i].name = taskName;
      tasks [i].type = taskType;
    }
  }
  saveTasks(); 

  alert("Task Updated!");
  formEl.removeAttribute("data-task-id");
  document.querySelector("save-task").textContent = "Add Task"; 
};

var taskFormHandler = function (event) {

    event.preventDefault();
    var taskNameInput = document.querySelector("Input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

  //check if input values are empty string
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false; 
  }
  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");
  

  // package up data as an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
  };

  // send it as an argument to createTaskEl
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };
  
    createTaskEl(taskDataObj);
}
};


var createTaskEl = function(taskDataObj) {

  // create list item 
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);
  //create div to hold task info
  var taskInfoEl = document.createElement("div");
  // git it a name
  taskInfoEl.className = "task-info";
  // add html content 
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);
  saveTasks(); 


  //add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  taskIdCounter++;
};

var createTaskActions = function(taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions"; 


// create edit button 
var editButtonEl = document.createElement("button");
editButtonEl.textContent = "Edit";
editButtonEl.className = "btn edit-btn";
editButtonEl.setAttribute("data-task-id", taskId); 

actionContainerEl.appendChild(editButtonEl);

// create delete button 
var deleteButtonEl = document.createElement("button");
deleteButtonEl.textContent = "Delete";
deleteButtonEl.className = "btn delete-btn";
deleteButtonEl.setAttribute("data-task-id", taskId); 

actionContainerEl.appendChild(deleteButtonEl);

var statusSelectEl = document.createElement("select");
statusSelectEl.className = "select-status";
statusSelectEl.setAttribute("name", "status-change");
statusSelectEl.setAttribute("data-task-id",taskId);

actionContainerEl.appendChild(statusSelectEl);

var statusChoices = ["To Do", "In Progress", "Completed"];

for (var i = 0; i < statusChoices.length; i++) {
  // create option element
  var statusOptionEl = document.createElement("option");
  statusOptionEl.textContent = statusChoices[i];
  statusOptionEl.setAttribute("value", statusChoices[i]);

  // append to select
  statusSelectEl.appendChild(statusOptionEl);
}

return actionContainerEl;
};

var taskButtonHandler = function(event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var editTask = function(taskId) {
  console.log(taskId);

  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);

  // get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  console.log(taskSelected);

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  document.querySelector("input[name='task-name']").value = taskName;

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("select[name='task-type']").value = taskType;
  
};

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  // create a mew array to hold updated tasks
  var updatedTaskArr = []

  // loop through tassks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[1].id doesnt match the value of taskId well keep it and push into new arrau
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr; 
  saveTasks(); 
};

var taskStatusChangeHandler = function(event) {
  var taskId = event.target.getAttribute("data-task-id");
  var statusValue = event.target.value.toLowerCase();
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
  

  // update tasks in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue; 
    }
  }

  saveTasks(); 
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// use loadtasks to accomplish the following 
// Gets task items from localStorage.

// Converts tasks from the string format back into an array of objects.

// Iterates through a tasks array and creates task elements on the page from it.


var loadTasks = function () {
// first line of code should reassign the tasks variable to whatever localStorage returns 
  var savedTasks = localStorage.getItem("tasks")
  console.log(savedTasks);


if (savedTasks) {
  return false;
}
  

tasks = JSON.parse(tasks); 

loadTasks();




}


formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);


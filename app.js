// TODO: consider: rather than keeping completed todos in BOTH arrays, move it from one to the other

// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

// Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteOrCheck);
filterOption.addEventListener("click", filterTodo);

// Functions --- TODO portion ---
function addTodo(event) {
  event.preventDefault();

  // create individual todo holder div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  // create and add todo list item title
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  // add todo to local storage
  saveNewTodo(todoInput.value);

  // create and add completed button
  const completeButton = document.createElement("button");
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.classList.add("complete-button");
  todoDiv.appendChild(completeButton);

  // create and add trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-button");
  todoDiv.appendChild(trashButton);

  // append entire individual todo div to the todo list
  todoList.appendChild(todoDiv);

  // clear todo input value
  todoInput.value = "";
}

function saveNewTodo(todo) {
  // check - do I already have things in there?
  let todos = getUncompleteFromLocal();
  todos.push(todo);
  setToLocalStorage("todos", todos);
}

function deleteOrCheck(event) {
  const item = event.target;
  if (item.classList[0] === "trash-button") {
    trashTodo(item);
  }

  // mark todo as complete
  if (item.classList[0] === "complete-button") {
    toggleCompleted(item);
  }
}

function trashTodo(item) {
  const todo = item.parentElement;
  // animation
  todo.classList.add("fall");

  // delete the todo from all local storage
  removeFromTodo(todo);
  if (todo.classList.contains("completed")) {
    removeFromCompleted(todo);
  }

  // wait until transion to remove todo element
  todo.addEventListener("transitionend", function () {
    todo.remove();
  });
}

function toggleCompleted(item) {
  const todo = item.parentElement;
  todo.classList.toggle("completed");

  // put the completed todo in completedTodos local storage
  if (todo.classList.contains("completed")) {
    const completedText = todo.children[0].innerText;
    let completedTodos = getCompletedFromLocal();
    completedTodos.push(completedText);
    setToLocalStorage("completedTodos", completedTodos);
    removeFromTodo(todo);
  } else {
    const completedText = todo.children[0].innerText;
    saveNewTodo(completedText);
    removeFromCompleted(todo);
  }
}

function filterTodo(event) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function getTodos() {
  let todos = getUncompleteFromLocal();
  let completedTodos = getCompletedFromLocal();
  const handledSet = new Set();

  todos.forEach(function (todo) {
    // check if it was already rendered as a completed item
    if (handledSet.has(todo)) {
      return;
    } else {
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");

      // create and add todo list item title
      const newTodo = document.createElement("li");
      newTodo.innerText = todo;
      newTodo.classList.add("todo-item");
      todoDiv.appendChild(newTodo);

      // create and add completed button
      const completeButton = document.createElement("button");
      completeButton.innerHTML = '<i class="fas fa-check"></i>';
      completeButton.classList.add("complete-button");
      todoDiv.appendChild(completeButton);

      // create and add trash button
      const trashButton = document.createElement("button");
      trashButton.innerHTML = '<i class="fas fa-trash"></i>';
      trashButton.classList.add("trash-button");
      todoDiv.appendChild(trashButton);

      // append entire individual todo div to the todo list
      todoList.appendChild(todoDiv);
    }
  });

  completedTodos.forEach(function (todo) {
    handledSet.add(todo);
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // toggle it to completed
    todoDiv.classList.toggle("completed");

    // create and add copmleted todo list item title
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // create and add completed button
    const completeButton = document.createElement("button");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.classList.add("complete-button");
    todoDiv.appendChild(completeButton);

    // create and add trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-button");
    todoDiv.appendChild(trashButton);

    // append entire individual todo div to the todo list
    todoList.appendChild(todoDiv);
  });
}

function removeFromTodo(todo) {
  let todos = getUncompleteFromLocal();
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  setToLocalStorage("todos", todos);
}

function removeFromCompleted(todo) {
  let completedTodos = getCompletedFromLocal();
  const todoIndex = todo.children[0].innerText;
  completedTodos.splice(completedTodos.indexOf(todoIndex), 1);
  setToLocalStorage("completedTodos", completedTodos);
}

function getUncompleteFromLocal() {
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function getCompletedFromLocal() {
  if (localStorage.getItem("completedTodos") === null) {
    completedTodos = [];
  } else {
    completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
  }
  return completedTodos;
}

function setToLocalStorage(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

// Functions --- Dog images portion ---
function ajax_get(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

ajax_get('https://api.thedogapi.com/v1/images/search?size=full', function(data) {
  // document.getElementById("id").innerHTML = data[0]["id"];
  // document.getElementById("url").innerHTML = data[0]["url"];

  var html = '<img src="' + data[0]["url"] + '">';
  document.getElementById("image").innerHTML = html;
});

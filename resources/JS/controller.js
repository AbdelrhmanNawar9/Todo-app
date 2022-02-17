import addTodo from "./views/addTodoView.js";
import listView from "./views/listView.js";
import listController from "./views/listControllerView.js";

import general from "./general.js";

import * as model from "./model.js";

//////////////////////////////////////////////////////////

const addTodoController = function () {
  // 1) Generate a todo object
  const todo = model.createTodoObject(addTodo.getInputText);

  // 2) Add the new todo to the view
  listView.renderTodo(todo);
  //load draggables
  listView.loadDraggables();

  // 3) store the new todo to the list
  model.addTodo(todo);

  // update the status
  listController.updateStatus(model.state.list);
};

const removeTodoController = function (id) {
  // 2-1 Remove from the View
  listView.removeTodo(id);

  //2-2 remove from the model
  model.removeTodo(id);

  // update the status
  listController.updateStatus(model.state.list);
};

const toggleTodoController = function (id) {
  // 3-1) Toggle in the View
  listView.toggledCheckedById(id);

  // 3-2) Toggle in the model
  model.toggledCheckedById(id);

  // update the status
  listController.updateStatus(model.state.list);
};

const clearCompletedController = function () {
  const listCompleted = model.state.list.filter((todo) => {
    return todo.checked === true;
  });

  listCompleted.forEach((todo) => {
    removeTodoController(todo.id);
  });

  if (model.state.list.length === 0) {
    listView.displayMessage();
  }
};

//////////////////////////// Filtering  //////////////////////////////

const filterCompController = function () {
  const listCompleted = model.state.list.filter((todo) => {
    return todo.checked === true;
  });

  listView.clear();
  listController.updateCurrent("completed");

  if (listCompleted.length === 0) {
    listView.displayMessage();
    return;
  }
  listCompleted.forEach((todo) => listView.renderTodo(todo));
  // loadDraggables();
};

const filterActiveController = function () {
  const listActive = model.state.list.filter((todo) => {
    return todo.checked === false;
  });

  listView.clear();
  listController.updateCurrent("active");

  if (listActive.length === 0) {
    listView.displayMessage();
    return;
  }
  listActive.forEach((todo) => listView.renderTodo(todo));
  // loadDraggables();
};

const filterAllController = function () {
  listView.clear();
  listController.updateCurrent("all");

  if (model.state.list.length === 0) {
    listView.displayMessage();
    return;
  }
  model.state.list.forEach((todo) => listView.renderTodo(todo));
  // loadDraggables();
};

//////////////////////////// local storage  //////////////////////////////

const loadSavedLocalStorage = function () {
  //load saved data in localstorage to state in model
  model.loadFromLocalStorage();

  //render saved todos
  model.state.list.forEach((todo) => listView.renderTodo(todo));

  //load draggables
  listView.loadDraggables();

  // update the status
  listController.updateStatus(model.state.list);

  // apply saved theme
  general.setTheme(model.state.theme);
};

//////////////////////////// theme  //////////////////////////////

const themeController = function () {
  general.toggleTheme();

  model.setTheme(general.theme);
};

//////////////////////////// drag and drop  //////////////////////////////

const dropHandler = function () {
  model.updateListOrder(listView.list);
};

//////////////////////////// Initials  //////////////////////////////

// init function
(function () {
  loadSavedLocalStorage();

  //load saved theme
  general.addHandlerTheme(themeController);

  //passing the handler to the view
  addTodo.addhandlerAddTodo(addTodoController);

  listView.addHandlerRemove(removeTodoController);
  listView.addHandlerToggle(toggleTodoController);
  listController.addHandlerFilter(
    clearCompletedController,
    filterAllController,
    filterActiveController,
    filterCompController
  );

  listView.addDropHandler(dropHandler);
})();

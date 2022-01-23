"use strict";

const appListEl = document.querySelector(".app__display__list");

// getting the list from localstorage
//(short circuiting with or operator) return the first value if its truthy value and if not then return the second value.
// first value id from localstorage after converting it to JS object
let list = JSON.parse(localStorage.getItem("list")) || [];

//view all todos from the list
function loadTodoFromList() {
  view(list);
}

function loadColorsFromLocalstorage() {
  if (localStorage.getItem("theme") === "light")
    document.querySelector("body").classList.remove("dark-theme");
}

//IEFE (Immediatly envoked function expression) (contains things we want to it run once after the the page is loaded )
(function () {
  // make todos from the list in the view
  loadTodoFromList();
  // load saved theme drom ocal storage
  loadColorsFromLocalstorage();

  // update the items left status
  updateStatus();
})();

/////////////////////////// Adding new todo
const newTodoText = document.querySelector("#text");

function addTodo() {
  // remove the the empty message if there were not items
  if (list.length === 0) {
    appListEl.innerHTML = "";
  }

  // generate a unique id for the new todo
  const id = Date.now();

  const newTodoInlist = { id: id, text: this.value, checked: false };

  // add the new todo to the view
  // only add the new todo to the view if the All filter is active
  if (
    !document
      .querySelector(".app__to-do--control__sorting button:last-child")
      .classList.contains("current")
  ) {
    // appListEl.insertAdjacentHTML("beforeend", newTodo);
    addTodoToView(newTodoInlist);
  }

  // add the new todo to the list
  list.push(newTodoInlist);

  //clear the input field
  newTodoText.value = "";

  //loadDraggables after adding the new todo
  loadDraggables();

  // update the items left status
  updateStatus();

  // save the new list to the local storage
  setLocalStorage();
}

// to run the addtodo when input value is commited
newTodoText.addEventListener("change", addTodo);

function addTodoToView(todo) {
  appListEl.insertAdjacentHTML(
    "beforeend",
    generateTodoMarkup(todo.id, todo.text, todo.checked)
  );
  // add handler to the newly added todo
  returnTodoById(todo.id).addEventListener("click", todoHandler);
}

// generate markup for todo
function generateTodoMarkup(id, text, checked = false) {
  return `<div class="app__to-do " draggable="true" >
  <div class="checkbox-group">
    <input
      type="checkbox"
      id="${id}" 
      ${checked ? "checked" : ""}
      class="checkbox-input"
    />
    <label class="checkbox-label" for="${id}">
      <span class="checkbox-button"></span>
      <p class="app__to-do__text checkbox-text">
       ${text}
      </p>
    </label>
  </div>
  
  <svg
    class="icon icon-cross"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    viewBox="0 0 18 18"
  >
    <path
      fill="#494C6B"
      fill-rule="evenodd"
      d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
    />
  </svg>
  </div>`;
}

/////////////////////delete a todo by id

function removeTodo(id) {
  // remove the target todo from the list
  const IndexToRemove = list.findIndex((todo) => todo.id === id);
  list.splice(IndexToRemove, 1);

  // remove the target todo from the view
  returnTodoById(id).remove();
  //an other solution
  // const selectorstring = `input.checkbox-input[id="${id}"]`;
  // appListEl.querySelector(selectorstring)?.closest(".app__to-do").remove();

  //display the empty message if there is no todo in the list after removing the target todo
  if (appListEl.querySelectorAll(".app__to-do").length === 0) {
    appListEl.innerHTML = `<p class="List__message app__to-do">There are no items.<P> `;
  }

  // update the items left status
  updateStatus();

  // save the new list to the local storage
  setLocalStorage();
}

// function to restore todos in list after draging and droping the some todos
function loadTodoInListAfterFilter() {
  // storing the old list
  const oldList = list;
  // clear the list
  list = [];

  //loading the filteredList from the container in the list
  appListEl.querySelectorAll(".app__to-do").forEach((todo) => {
    list.push({
      id: +todo.querySelector("input.checkbox-input").attributes.id.value,
      text: todo.querySelector(".checkbox-text").innerText,
      checked: todo.querySelector("input.checkbox-input").checked,
    });
  });

  // adding the rest todo to from the oldList
  oldList.forEach((oldListTodo) => {
    //push the oldlisttodo to the list if the oldlisttodo is not in the list
    if (!list.some((listTodo) => listTodo.id === oldListTodo.id)) {
      list.push(oldListTodo);
    }
  });

  // save the new list to the local storage
  setLocalStorage();
}

function todoHandler(e) {
  // for testing
  // console.log("this", this);
  // console.log("e.currentTarget", e.currentTarget);
  // console.log("e.target", e.target);

  // 1- know the id of the clicked todo
  const id = +e.target
    .closest(".app__to-do")
    .querySelector("input.checkbox-input").attributes.id.value;
  console.log(id);

  // remove todo if the target was the cross and don't continue the todoHandler function
  if (e.target.closest(".icon-cross")) {
    removeTodo(id);
    return;
  }

  //otherwise toggle check (check or uncheck the todo)
  toggleCheckById(id);
}

// function to find a todo and return it by its id
function returnTodoById(id) {
  const selectorstring = `input.checkbox-input[id="${id}"]`;
  return appListEl.querySelector(selectorstring).closest(".app__to-do");
}

// function to toggle check to a todo by its id
function toggleCheckById(id) {
  list.forEach((todo) => {
    if (+todo.id === id)
      if (todo.checked) {
        // changing status in the List
        todo.checked = false;
        //changing the status in the view
        returnTodoById(id).querySelector(
          "input.checkbox-input"
        ).checked = false;
      } else {
        todo.checked = true;
        returnTodoById(id).querySelector("input.checkbox-input").checked = true;
      }
  });

  // update the items left status
  updateStatus();

  // save the new list to the local storage
  setLocalStorage();
}

////////////////////////////////////////////////// buttons
// function to add a list of todos to the view
function view(filteredList) {
  if (filteredList === null) return;
  // clear the view
  appListEl.innerHTML = "";

  if (filteredList.length === 0) {
    appListEl.innerHTML = `<p class="List__message app__to-do">There are no items.<P> `;
    return;
  }

  // add fiteredList items to the view
  filteredList.forEach((todo) => {
    addTodoToView(todo);
  });
}

function filterComp() {
  const listCompleted = list.filter((todo) => {
    return todo.checked === true;
  });

  view(listCompleted);
  updateCurrent("completed");
  loadDraggables();
}

function filterActive() {
  const listActive = list.filter((todo) => {
    return todo.checked === false;
  });

  view(listActive);
  updateCurrent("active");
  loadDraggables();
}

function filterAll() {
  view(list);
  updateCurrent("all");
  loadDraggables();
}

function clearCompleted() {
  const listCompleted = list.filter((todo) => {
    return todo.checked === true;
  });

  listCompleted.forEach((todo) => {
    removeTodo(todo.id);
  });

  // display the empty message if there are no items
  if (list.length === 0) view([]);
}

const btnCompleted = document.querySelector(".btn-txt.completed");
const btnActive = document.querySelector(".btn-txt.active");
const btnAll = document.querySelector(".btn-txt.all");
const btnclearComp = document.querySelector(".btn-txt.clear-completed");

btnCompleted.addEventListener("click", filterComp);
btnActive.addEventListener("click", filterActive);
btnAll.addEventListener("click", filterAll);
btnclearComp.addEventListener("click", clearCompleted);

// function to update items left status
function updateStatus() {
  const listActive = list.filter((todo) => {
    return todo.checked === false;
  });

  document.querySelector(
    ".app__to-do--control__info"
  ).innerText = `${listActive.length} items left`;
}

// making the cursor go to the input field when clicking on the the creat-todo
document.querySelector(".app__to-do--create").addEventListener("click", (e) => {
  const input = document.querySelector('input[id="text"]');
  input.focus();
  input.select();
});

//////////Dark Theme
// Select the theme button
const btnSwitchTheme = document.querySelectorAll(".app__header .icon");

// Listen for a click on the button
btnSwitchTheme.forEach((btn) =>
  btn.addEventListener("click", function () {
    // Then toggle (add/remove) the .dark-theme class to the body
    document.body.classList.toggle("dark-theme");

    //store a reference value for the theme in the localstorage
    setColorsInLocalStorage();
  })
);

/// to mark the btn for the current view active
function updateCurrent(btnToBeCurrent) {
  document
    .querySelectorAll(".app__to-do--control__sorting button ")
    .forEach((btn) => {
      //reset all btns
      btn.classList.remove("current");

      // activate the btn that contains (all or active or completed ) class
      if (btn.classList.contains(btnToBeCurrent)) btn.classList.add("current");
    });
}

////// Drag and Drop Feature
function loadDraggables() {
  const draggables = appListEl.querySelectorAll(".app__to-do");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () =>
      draggable.classList.add("dragging")
    );

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");

      // //updating the list with the new order only is All filter is active
      // if (
      //   document
      //     .querySelector(".app__to-do--control__sorting button:first-child")
      //     .classList.contains("current")
      // )
      //   loadTodoInList();

      loadTodoInListAfterFilter();
    });
  });
}
loadDraggables();

appListEl.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = GetDragAfterElement(appListEl, e.clientY);

  const draggable = document.querySelector(".dragging");

  // append as a last element if there is no afterElement
  if (afterElement == null) appListEl.appendChild(draggable);
  //else append before the afterElement
  else {
    appListEl.insertBefore(draggable, afterElement);
  }
});

function GetDragAfterElement(container, y) {
  // select all the draggable elements except the dragged element
  const draggableElements = [
    ...container.querySelectorAll(".app__to-do:not(.dragging)"),
  ];

  // geting after element
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      // console.log(box);
      const offset = y - box.top - box.height / 2;
      // console.log(offset);

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
        //for offset < closest.offset
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}

// local storage
// set list in localStorage
function setLocalStorage() {
  window.localStorage.setItem("list", JSON.stringify(list));
}

// set theme in localStorage
function setColorsInLocalStorage() {
  document.querySelector("body").classList.contains("dark-theme")
    ? window.localStorage.setItem("theme", "dark")
    : window.localStorage.setItem("theme", "light");
}

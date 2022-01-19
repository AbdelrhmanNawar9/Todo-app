"use strict";

/////////////////////////// Adding new todo

const appListEl = document.querySelector(".app__display__list");
const newTodoText = document.querySelector("#text");
let todoCounter = 7;

// local storage

function addTodo() {
  // add the new todo to the view

  // generate a unique id for the new todo
  const id = Date.now();

  const newTodo = generateTodoMarkup(id, this.value);

  // remove the the empty message if there were not items
  if (list === null) return;

  if (list.length === 0) {
    appListEl.innerHTML = "";
  }

  appListEl.insertAdjacentHTML("beforeend", newTodo);

  // add the new todo to the list
  list.push(returnTodoById(id));

  //clear the input field
  newTodoText.value = "";

  //add todoHandler to new the new todo
  returnTodoById(id).addEventListener("click", todoHandler);

  //loadDraggables after adding the new todo
  loadDraggables();

  // update the items left status
  updateStatus();

}

// to run the addtodo when input value is commited
newTodoText.addEventListener("change", addTodo);

/////////////////////delete a todo by id

function removeTodo(id) {
  // remove the to do from the list
  const IndexToRemove = list.findIndex(
    (todo) =>
      +todo.querySelector("input.checkbox-input").attributes.id.value === id
  );
  list.splice(IndexToRemove, 1);

  // removefrom the view
  const selectorstring = `input.checkbox-input[id="${id}"]`;
  appListEl.querySelector(selectorstring)?.closest(".app__to-do").remove();

  updateStatus();

}

function generateTodoMarkup(id, text) {
  return `<div class="app__to-do " draggable="true" >
  <div class="checkbox-group">
    <input
      type="checkbox"
      id="${id}" 
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

///////////////////// filter to do

// storing the viewed in list



let list = [];

function loadTodoInList() {
  appListEl.querySelectorAll(".app__to-do").forEach((todo) => {
    list.push(todo);
    todo.addEventListener("click", todoHandler);
  });
}

loadTodoInList();



function loadTodoInListAfterFilter() {
  const oldList = list;
  list = [];

  //loading the filteredList from the container in the list
  appListEl.querySelectorAll(".app__to-do").forEach((todo) => {
    list.push(todo);
    todo.addEventListener("click", todoHandler);
  });

  oldList.forEach((todo) => {
    //push the todo to the list if the todo is not in the list
    if (!list.includes(todo)) {
      list.push(todo);
    }
  });

}

updateStatus();

function todoHandler(e) {
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

  //otherwise check the todo
  toggleCheckById(id);
}

// function to find a todo and return it by its id
function returnTodoById(id) {
  const selectorstring = `input.checkbox-input[id="${id}"]`;
  return appListEl.querySelector(selectorstring).closest(".app__to-do");
}

function view(filteredList) {
  console.log(filteredList);
  if (filteredList === null) return;
  // clear the view
  appListEl.innerHTML = "";

  if (filteredList.length === 0) {
    appListEl.innerHTML = `<p class="List__message app__to-do">There are no items.<P> `;
  }

  // append fiteredList items to the view
  filteredList.forEach((todo) => {
    appListEl.appendChild(todo);
  });
}

function filterComp() {
  const listCompleted = list.filter((todo) => {
    return todo.querySelector("input.checkbox-input").checked === true;
  });

  view(listCompleted);
  updateCurrent("completed");
}

function filterActive() {
  const listActive = list.filter((todo) => {
    return todo.querySelector("input.checkbox-input").checked === false;
  });
  console.log(listActive);

  view(listActive);
  updateCurrent("active");
}

function filterAll() {
  view(list);
  updateCurrent("all");
}

function toggleCheckById(id) {
  console.log("toggle");
  list.forEach((todo) => {
    if (+todo.querySelector("input.checkbox-input").attributes.id.value === id)
      todo.querySelector("input.checkbox-input").checked
        ? (todo.querySelector("input.checkbox-input").checked = false)
        : (todo.querySelector("input.checkbox-input").checked = true);
  });

  updateStatus();
}

function clearCompleted() {
  // let idListToRemoved = [];
  // list.forEach((todo) => {
  //   if (todo.querySelector("input.checkbox-input").checked) {

  //     const id = +todo.querySelector("input.checkbox-input").attributes.id
  //       .value;
  //     idListToRemoved.push(id);

  //     // todo.remove();
  //   }
  // });

  // idListToRemoved.forEach((id) => removeTodo(id));

  const listCompleted = list.filter((todo) => {
    return todo.querySelector("input.checkbox-input").checked === true;
  });

  listCompleted.forEach((todo) => {
    const id = +todo.querySelector("input.checkbox-input").attributes.id.value;
    removeTodo(id);
  });

  console.log(list);

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

// update items left status
function updateStatus() {
  if (list === null) return;

  const listActive = list.filter((todo) => {
    return todo.querySelector("input.checkbox-input").checked === false;
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

//*********************************************** */
//Development functions

function showStatus() {
  list.forEach((todo, i) =>
    console.log(`${i + 1}`, todo.querySelector("input.checkbox-input").checked)
  );
}

////////Dark Theme
// Select the button
const btnSwitchTheme = document.querySelectorAll(".app__header .icon");

// Listen for a click on the button
btnSwitchTheme.forEach((btn) =>
  btn.addEventListener("click", function () {
    // Then toggle (add/remove) the .dark-theme class to the body
    document.body.classList.toggle("dark-theme");
  })
);

/// to mark the current view

function updateCurrent(btnToBeCurrent) {
  document
    .querySelectorAll(".app__to-do--control__sorting button ")
    .forEach((btn) => {
      //reset all btns

      btn.classList.remove("current");

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

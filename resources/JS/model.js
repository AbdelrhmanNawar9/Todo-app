import settings from "./settings.js";

export const state = {
  list: [
    {
      text: "Complete online JavaScript course",
      checked: true,
      id: 1645299429921,
    },
    {
      text: "Jog around the park 3x",
      checked: false,
      id: 1645299442426,
    },
    {
      text: "10 minutes meditation",
      checked: false,
      id: 1645299448295,
    },
    {
      text: "Read for 1 hour",
      checked: false,
      id: 1645299455827,
    },
    {
      text: "Pick up groceries",
      checked: false,
      id: 1645299471138,
    },
    {
      text: "Complete Todo App on Frontend Mentor",
      checked: false,
      id: 1645299500430,
    },
  ],
  theme: settings.defaultTheme,
};

export const createTodoObject = function (text) {
  return {
    text: text,
    checked: false,
    id: Date.now(),
  };
};

export const convertDOMTodoToObj = function (todo) {
  return {
    id: +todo.querySelector("input.checkbox-input").attributes.id.value,
    text: todo.querySelector(".checkbox-text").innerText,
    checked: todo.querySelector("input.checkbox-input").checked,
  };
};

export const addTodo = function (todo) {
  state.list.push(todo);
  setLocalStorage();
};

export const removeTodo = function (id) {
  const IndexToRemove = state.list.findIndex((todo) => +todo.id === id);
  state.list.splice(IndexToRemove, 1);
  setLocalStorage();
};

export const toggledCheckedById = function (id) {
  state.list.forEach((todo) => {
    if (+todo.id === id)
      todo.checked ? (todo.checked = false) : (todo.checked = true);
  });
  setLocalStorage();
};

// local storage
// set list in localStorage
export function setLocalStorage() {
  window.localStorage.setItem("list", JSON.stringify(state.list));
}

// set theme in localstorage and state
export function setTheme(currnetTheme) {
  if (currnetTheme === "dark") {
    window.localStorage.setItem("theme", "dark");
    state.theme = "dark";
  } else {
    window.localStorage.setItem("theme", "light");
    state.theme = "light";
  }

  // set theme in state
}
//load from local storage
export function loadFromLocalStorage() {
  state.list = JSON.parse(localStorage.getItem("list")) || state.list || [];

  // only set the theme in state if not null
  localStorage.getItem("theme")
    ? (state.theme = localStorage.getItem("theme"))
    : "";
}

// drag and drop
// function to restore todos in list after draging and droping some todos
export function updateListOrder(currentList) {
  // storing the old list

  const oldList = state.list;
  // clear the list
  state.list = [];

  //loading the filteredList from the container in the list
  currentList.forEach((todo) => {
    addTodo(todo);
  });

  // adding the rest todo to from the oldList
  oldList.forEach((oldListTodo) => {
    //push the oldlisttodo to the list if the oldlisttodo is not in the list
    if (!state.list.some((listTodo) => listTodo.id === oldListTodo.id)) {
      addTodo(oldListTodo);
    }
  });
}

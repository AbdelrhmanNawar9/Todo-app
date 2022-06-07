import todoPreview from "./previewTodoView.js";

class ListView {
  #parentElement = document.querySelector(".app__display__list");

  constructor() {
    // to make this in the handler point to the ListView instance not to dragoverHandler method
    this.#parentElement.addEventListener(
      "dragover",
      this.dragoverHandler.bind(this)
    );
  }

  renderTodo(todo) {
    // remove the the empty message if there were no todos items
    if (this.#parentElement.querySelectorAll(".List__message").length !== 0) {
      this.clear();
    }
    const todoHTML = this.generateMarkup(todo);
    this.#parentElement.insertAdjacentHTML("beforeend", todoHTML);
    this.loadDraggables();
  }

  clear() {
    this.#parentElement.innerHTML = "";
  }

  generateMarkup(todo) {
    return todoPreview.generateMarkup(todo);
  }

  // addHandlerTodo(handler) {
  //   this.#parentElement.addEventListener("click", handler);
  // }

  addHandlerRemove(handler) {
    this.#parentElement.addEventListener("click", function (e) {
      const id = +e.target
        .closest(".app__to-do")
        .querySelector("input.checkbox-input").attributes.id.value;

      const cross = e.target.closest(".icon-cross");
      if (!cross) return;
      handler(id);
    });
  }

  addHandlerToggle(handler) {
    this.#parentElement.addEventListener("click", function (e) {
      const id = +e.target
        .closest(".app__to-do")
        .querySelector("input.checkbox-input").attributes.id.value;

      const cross = e.target.closest(".icon-cross");
      if (!cross) handler(id);
    });
  }

  returnTodoById(id) {
    const selectorstring = `input.checkbox-input[id="${id}"]`;
    return this.#parentElement
      .querySelector(selectorstring)
      .closest(".app__to-do");
  }

  removeTodo(id) {
    this.returnTodoById(id).remove();

    if (this.#parentElement.querySelectorAll(".app__to-do").length === 0)
      this.displayMessage();
  }

  toggledCheckedById(id) {
    const todo = this.returnTodoById(id);
    if (todo.querySelector("input.checkbox-input").checked) {
      todo.querySelector("input.checkbox-input").checked = false;
    } else {
      todo.querySelector("input.checkbox-input").checked = true;
    }
  }

  displayMessage() {
    this.#parentElement.innerHTML = `<p class="List__message app__to-do">There are no items.<P> `;
  }

  // drag and drop
  loadDraggables() {
    const draggables = this.#parentElement.querySelectorAll(".app__to-do");
    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () =>
        draggable.classList.add("dragging")
      );

      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
      });
    });
  }

  addDropHandler(handler) {
    // event is propagated up to the parent so we can listen for it in the parent
    this.#parentElement.addEventListener("dragend", handler);
  }

  getDragAfterElement(container, y) {
    // select all the draggable elements except the dragged element
    const draggableElements = [
      ...container.querySelectorAll(".app__to-do:not(.dragging)"),
    ];

    // geting after element
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

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
  dragoverHandler(e) {
    e.preventDefault();
    const afterElement = this.getDragAfterElement(
      this.#parentElement,
      e.clientY
    );

    const draggable = document.querySelector(".dragging");

    // append as a last element if there is no afterElement
    if (afterElement == null) this.#parentElement.appendChild(draggable);
    //else append before the afterElement
    else {
      this.#parentElement.insertBefore(draggable, afterElement);
    }
  }

  get currentDOMList() {
    return this.#parentElement.querySelectorAll(".app__to-do");
  }

  get list() {
    // updateListOrder();
    //loading the filteredList from the container in the list

    return [...this.currentDOMList].map((todo) =>
      this.convertDOMTodoToObj(todo)
    );
  }

  convertDOMTodoToObj(todo) {
    return {
      id: +todo.querySelector("input.checkbox-input").attributes.id.value,
      text: todo.querySelector(".checkbox-text").innerText,
      checked: todo.querySelector("input.checkbox-input").checked,
    };
  }
}

export default new ListView();

class TodoPreview {
  #parentElement = "";

  generateMarkup(todo) {
    return `<div class="app__to-do " draggable="true" >
    <div class="checkbox-group">
      <input
        type="checkbox"
        id="${todo.id}" 
        ${todo.checked ? "checked" : ""}
        class="checkbox-input"
      />
      <label class="checkbox-label" for="${todo.id}">
        <span class="checkbox-button"></span>
        <p class="app__to-do__text checkbox-text">
         ${todo.text}
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
}

export default new TodoPreview();

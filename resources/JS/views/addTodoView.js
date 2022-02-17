class AddTodo {
  #parentElement = document.querySelector("#text");

  get getInputText() {
    const input = this.#parentElement.value;
    // capitalize the first letter
    const text = input.charAt(0).toUpperCase() + input.slice(1);
    this.#clear();
    return text;
  }

  addhandlerAddTodo(handler) {
    // we used change event not submit event as the input field has not button to submit we insted submit using enter
    this.#parentElement.addEventListener("change", handler);
  }

  // clear the the input field
  #clear() {
    this.#parentElement.value = "";
  }
}

export default new AddTodo();

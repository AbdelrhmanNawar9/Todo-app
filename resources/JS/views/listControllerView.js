class ListController {
  #parentElement = "";

  addHandlerFilter(
    clearCompletedController,
    filterAll,
    filterActive,
    filtercompleted
  ) {
    document
      .querySelector(".btn-txt.clear-completed")
      .addEventListener("click", clearCompletedController);

    document.querySelector(".btn-txt.all").addEventListener("click", filterAll);

    document
      .querySelector(".btn-txt.active")
      .addEventListener("click", filterActive);

    document
      .querySelector(".btn-txt.completed")
      .addEventListener("click", filtercompleted);
  }

  updateStatus(list) {
    const listActive = list.filter((todo) => {
      return todo.checked === false;
    });

    document.querySelector(
      ".app__to-do--control__info"
    ).innerText = `${listActive.length} items left`;
  }

  // to mark the btn for the current view active
  updateCurrent(btnToBeCurrent) {
    document
      .querySelectorAll(".app__to-do--control__sorting button ")
      .forEach((btn) => {
        //reset all btns
        btn.classList.remove("current");

        // activate the btn that contains (all or active or completed ) class
        if (btn.classList.contains(btnToBeCurrent))
          btn.classList.add("current");
      });
  }
}

export default new ListController();

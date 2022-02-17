class General {
  addHandlerTheme(handler) {
    // Select the theme button
    const btnSwitchTheme = document.querySelectorAll(".app__header .icon");

    // Listen for a click on the button
    btnSwitchTheme.forEach((btn) => btn.addEventListener("click", handler));
  }

  toggleTheme() {
    document.body.classList.toggle("dark-theme");
  }

  get theme() {
    return document.querySelector("body").classList.contains("dark-theme")
      ? "dark"
      : "light";
  }

  setTheme(targetTheme) {
    // if target theme is dark and there was no darktheme calss
    if (
      targetTheme === "dark" &&
      !document.querySelector("body").classList.contains("dark-theme")
    ) {
      document.querySelector("body").classList.add("dark-theme");
    }
  }
}

export default new General();

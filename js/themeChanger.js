// themesChanger
let themesButton = document.querySelector("[data-theme-button]")
const themeHandler = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark")
    localStorage.theme = "light"
    return
  }
  document.documentElement.classList.add("dark")
  localStorage.theme = "dark"
  return
}
themesButton.addEventListener("click", themeHandler)
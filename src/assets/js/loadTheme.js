const isDarkThemeStored = localStorage.theme === 'dark'
const isDarkThemePreferred = !localStorage.theme &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
const dataset = document.documentElement.dataset

if (
  isDarkThemeStored || isDarkThemePreferred
) {
  dataset.theme = "dark"
} else {
  dataset.theme = "light"
}

if (localStorage.theme) {
  dataset.theme = localStorage.theme
}

if (localStorage.colorScheme) {
  dataset.colorScheme = localStorage.colorScheme
}
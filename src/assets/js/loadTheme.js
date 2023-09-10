if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.dataset.theme = "dark"
} else {
  document.documentElement.dataset.theme = "light"
}

if (localStorage.theme) {
  document.documentElement.dataset.theme = localStorage.theme
}

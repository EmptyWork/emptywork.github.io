if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.dataset.theme = "dark"
} else {
  document.documentElement.dataset.theme = "light"
}

if (localStorage.scheme) {
  document.documentElement.dataset.theme = localStorage.scheme
}

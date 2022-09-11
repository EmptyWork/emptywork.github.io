/**
 * Fetching data from the said url
 * @param {string} url
 */
const dataLoader = async (url) => {
  const response = await fetch(url)
  const data = await response.json()
  if (response) {
    schedulerLoader(data.schedules)
    schemeLoader(data.colorScheme)
  }
}

dataLoader("/settings.json")

const schemeLoader = (scheme) => {
  localStorage.scheme = scheme
}

/**
 * Mobile hamburger menu logic
 */
const mobileButtons = document.querySelectorAll("[data-mobile-menu-button]")
const mobileMenuSection = document.querySelector("[data-mobile-menu-section]")
const mobileMenuLinks = document.querySelectorAll("body>ul>li")

mobileButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!mobileMenuSection.classList.contains("not-showing")) return setHidden()
    return setShowing()
  })
})

const setShowing = () => {
  mobileButtons[0].setAttribute("aria-label", "Close the mobile menu")
  mobileMenuSection.classList.remove("not-showing")
  setTimeout(() => document.body.classList.add("no-scroll"), 300)
}

const setHidden = () => {
  mobileButtons[0].setAttribute("aria-label", "Open the mobile menu")
  mobileMenuSection.classList.add("not-showing")
  document.body.classList.remove("no-scroll")
}

/**
 * Capitalize the word
 * @param {string} string
 */

const toCapitalizeWord = (string) => {
  return string[0].toUpperCase() + string.substring(1)
}

/**
 * Changing the theme based on user toggle
 */
const themesButton = document.querySelector("[data-theme-button]")

const themeHandler = () => {
  if (!document.documentElement.classList.contains("dark")) return setDark()
  return setLight()
}

themesButton.addEventListener("click", themeHandler)

const setLight = () => {
  document.documentElement.classList.remove("dark")
  themesButton.setAttribute("aria-label", "Switch to dark mode")
  localStorage.theme = "light"
}

const setDark = () => {
  document.documentElement.classList.add("dark")
  themesButton.setAttribute("aria-label", "Switch to light mode")
  localStorage.theme = "dark"
}

/**
 * Printing details on console
 */

console.log(
  "%cEmptywork Console%c\nemptywork dot github dot io%c\n emptywork dot github dot io%c\nEnd of Console%c\n NOTE %c DON'T COPY ANY CODE INTO HERE",
  "background-color:#cecece; margin: 0.15em; padding: 0.1em; border-radius: 0.2em; color:transparent; font-size:1rem",
  "background-color:rebeccapurple; margin: 0.15em; padding: 0.1em; border-radius: 0.2em; color:transparent; font-size:1rem",
  "font-size:1.2rem",
  "background-color:#cecece; margin: 0.15em; padding: 0.1em; border-radius: 0.2em; color:transparent; font-size:1rem",
  "background-color:rebeccapurple; margin: 0.15em; padding: 0.1em; border-radius: 0.2em; font-size:1rem",
  "color: rebeccapurple; font-size: 1.1rem"
)

/**
 * Global Variables for Date related functions
 */
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const replaceStatus = document.querySelector("#activity")
const replaceMonth = document.querySelector("#month")
const replaceYear = document.querySelector("#year")

const currentDate = new Date()
const currentDay = currentDate.getDay()
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()

if (replaceMonth) replaceMonth.textContent = months[currentMonth]
if (replaceYear) replaceYear.textContent = currentYear

/**
 * Updating activity status based on array of schedule
 * @param {array} schedules
 */

const schedulerLoader = (schedules = {}) => {
  let time = new Date()
  let currentTime = time.getUTCHours() + 9
  if (currentTime > 23) currentTime -= 23

  if (replaceStatus) replaceStatus.textContent = "Idle"

  setTimeout(() => {
    for (let i = 0; i < schedules.length; i++) {
      let { day, endHour, startHour } = schedules[i]
      if (!replaceStatus) return

      if (days[currentDay] === toCapitalizeWord(day)) {
        if (currentTime > startHour && currentTime < endHour) {
          replaceStatus.textContent = "Studying"
        }
        break
      }
      replaceStatus.textContent = "Idle"
    }
  }, 0)
}

// Injecting #main to main that doesn't have #main
const mainElem =
  document.querySelector("#main") ?? document.querySelector(".main")
mainElem.id = "main"

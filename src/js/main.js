/**
 * Fetching data from the said url
 * @param {string} url
 */
const dataLoader = async (url) => {
  const response = await fetch(url)
  const data = await response.json()
  if (response) {
    schedulerLoader(data.schedules)
  }
}

dataLoader("/settings.json")

/**
 * Mobile hamburger menu logic
 */
let mobileButtons = document.querySelectorAll("[data-mobile-menu-button]")
let mobileMenuSection = document.querySelector("[data-mobile-menu-section]")
let mobileMenuLinks = document.querySelectorAll("body>ul>li")

mobileButtons.forEach( button => {
  button.addEventListener("click", () => {
    if (mobileMenuSection.classList.contains("not-showing")) {
      setShowing()
      return
    }
    setHidden()
    return
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
 * Changing the theme based on user toggle
 */
let themesButton = document.querySelector("[data-theme-button]")

const themeHandler = () => {
  if (document.documentElement.classList.contains("dark")) {
    setLight()
    return
  }
  setDark()
  return
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
console.group("Emptywork -- Dev")
console.log(
  "%cEmptywork %c console",
  "background-color:#cecece; margin:2px; color:transparent; font-size:0.7rem"
)
console.log(
  "%cdot one %c com",
  "background-color:rebeccapurple; margin:2px; color:transparent; font-size:0.7rem"
)
console.log("%cemptywork dot github dot io", "font-size:0.88rem")
console.log(
  "%cEmptywork Console %c testing",
  "background-color:#cecece; margin:2px; color:transparent; font-size:0.7rem"
)
console.groupEnd()

/**
 * Global Variables for Date related functions
 */
 let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

 let months = [
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
 
 let replaceStatus = document.querySelector("#activity")
 let replaceMonth = document.querySelector("#month")
 
 let currentDate = new Date()
 let currentDay = currentDate.getDay()
 let currentMonth = currentDate.getMonth()
 
 if(replaceMonth) replaceMonth.textContent = months[currentMonth]
 
 /**
  * Updating activity status based on array of schedule
  * @param {array} schedules
  */
 
 const schedulerLoader = (schedules) => {
   for (let i = 0; i < schedules.length; i++) {
     if (!replaceStatus) return
     if (days[currentDay] === schedules[i]) {
       replaceStatus.textContent = "Kuliah"
       break
     }
     replaceStatus.textContent = "Bebas"
   }
 }
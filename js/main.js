/**
 * Fetching data from the said url
 * @param {string} url
 */
const dataLoader = async (url) => {
  const response = await fetch(url)
  const data = await response.json()
  if (response) {
    schedulerLoader(data.schedules)
    projectsLoader(data.works)
  }
}

dataLoader("../data.json")

/**
 * Mobile hamburger menu logic
 */
let mobileButton = document.querySelector("[data-mobile-menu-button]")
let mobileMenuSection = document.querySelector("[data-mobile-menu-section]")

mobileButton.addEventListener("click", () => {
  if (mobileMenuSection.classList.contains("not-showing")) {
    setShowing()
    return
  }
  setHidden()
  return
})

const setShowing = () => {
  mobileButton.setAttribute('aria-label','Close the mobile menu')
  mobileMenuSection.classList.remove("not-showing")
  setTimeout(() => document.body.classList.add("no-scroll"), 300)
}

const setHidden = () => {
  mobileButton.setAttribute('aria-label','Open the mobile menu')
  mobileMenuSection.classList.add("not-showing")
  document.body.classList.remove("no-scroll")
}

/**
 * Global Variables for Date related functions
 */
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

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

replaceMonth.textContent = months[currentMonth]

/**
 * Updating activity status based on array of schedule
 * @param {array} schedules
 */

const schedulerLoader = (schedules) => {
  for (let i = 0; i < schedules.length; i++) {
    if (days[currentDay] === schedules[i]) {
      replaceStatus.textContent = "Kuliah"
      break
    }
    replaceStatus.textContent = "Bebas"
  }
}

/**
 * Loading the list of project div based on the array of project
 * @param {array} projects
 */

const projectsLoader = (projects) => {
  let worksSection = document.querySelector(".projects")
  projects.forEach((project) => {
    createNewProject(project, worksSection)
  })
}

/**
 * Creating a new figure from the project object
 * @param {object} project
 * @param {any} workSection
 */

const createNewProject = (
  { name, started_at, finished_at, details, links, image },
  workSection
) => {
  let projectLink = document.createElement("a")
  projectLink.href = "#projects"
  projectLink.classList.add('projectlink')
  projectLink.setAttribute("arial-label", `Project: ${name}`)
  let projectContainer = document.createElement("figure")
  projectContainer.classList.add("project", "t-all")
  projectContainer.setAttribute('title', `Image of ${name}`)
  if (image)
    projectContainer.style.backgroundImage = `linear-gradient(transparent, var(--clr-accent-dark)), url(${image})`
  projectContainer.innerHTML = `
  <figcaption>
    <header>
      <h2>${name}</h2> 
      <small>${
        finished_at != null ? `${finished_at} ` : `${started_at} — Present`
      }</small>
    </header>
    <article class="description-area">
      <p>${details}</p>
    </article>
    <ul class="more-links">
    ${
      links
        ? `
        ${links[0] ? `<li><a href="${links[0]}" target="_blank" class="sourcecode">sourcecode</a></li>` : `<li><a href="#projects" disabled class="sourcecode">sourcecode</a></li>`}
        ${links[1] ? `<li><a href="${links[1]}" target="_blank" class="sourcecode">demo</a></li>` : `<li><a href="#projects" disabled class="sourcecode">demo</a></li>`}
      `
        : `
      <li><a href="#projects" disabled class="sourcecode">sourcecode</a></li>
      <li><a href="#projects" disabled class="sourcecode">demo</a></li>
      `
    }
    </ul>
    </figcaption>
    `
  projectLink.appendChild(projectContainer)
  workSection.appendChild(projectLink)
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
  themesButton.setAttribute('aria-label', 'Switch to dark mode')
  localStorage.theme = "light"
}

const setDark = () => {
  document.documentElement.classList.add("dark")
  themesButton.setAttribute('aria-label', 'Switch to light mode')
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

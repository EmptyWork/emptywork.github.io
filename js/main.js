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
  projectLink.classList.add("projectlink")
  projectLink.setAttribute("arial-label", `Project: ${name}`)
  projectLink.innerHTML = '<span class="new-tab-warning"> Open a new tab </span>'
  let projectContainer = document.createElement("figure")
  projectContainer.classList.add("project", "t-all")
  projectContainer.setAttribute("title", `Image of ${name}`)
  if (image)
    projectContainer.style.backgroundImage = `linear-gradient(transparent, var(--clr-accent-dark)), url(${image})`
  projectContainer.innerHTML = `
  <figcaption>
    <header>
      <h2 title="${name}">${name.length >= 21 ? `${name.substring(0, 20)}...` : name}</h2> 
      <small>${finished_at != null ? `${finished_at} ` : `${started_at} — Present`}</small>
    </header>
    <article class="description-area">
      <p>${details}</p>
    </article>
    <ul class="more-links">
    ${
      links
        ? `
        ${
          links[0]
            ? `<li><a href="${links[0]}" target="_blank" class="sourcecode"><svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Icon for code"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>sourcecode <span class="new-tab-warning"> Open a new tab </span></a></li>`
            : `<li><span class="sourcecode">sourcecode</span></li>`
        }
        ${
          links[1]
            ? `<li><a href="${links[1]}" target="_blank" class="sourcecode">
            <svg fill="currentColor" aria-label="Icon for demo link" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>demo <span class="new-tab-warning"> Open a new tab </span></a></li>`
            : `<li><a aria-disabled="true" disabled class="sourcecode">demo</a></li>`
        }
      `
        : `
      <li><span class="sourcecode">sourcecode</span></li>
      <li><span class="sourcecode">demo</span></li>
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

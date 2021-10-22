// mobileShow
let mobileButton = document.querySelector("[data-mobile-menu-button]")
mobileButton.addEventListener("click", () => {
  let mobileMenuSection = document.querySelector("[data-mobile-menu-section]")
  if (mobileMenuSection.classList.contains("not-showing")) {
    mobileMenuSection.classList.remove("not-showing")
    setTimeout(() => document.body.classList.add("no-scroll"), 300)
    return
  }
  mobileMenuSection.classList.add("not-showing")
  document.body.classList.remove("no-scroll")
  return
})

const dataLoader = async (url) => {
  const response = await fetch(url)
  const data = await response.json()
  if(response) {
    schedulerLoader(data.schedules)
    projectsLoader(data.works)
  }
}

dataLoader('../data.json')

// schedulerLoader
let currentDate = new Date()
const schedulerLoader = (schedules) => {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  let replaceStatus = document.querySelector("#activity")
  let currentDay = currentDate.getDay()

  for(let i = 0; i < schedules.length; i++) {
    if(days[currentDay] === schedules[i]) {
      replaceStatus.textContent = "Kuliah";
      break
    }
    replaceStatus.textContent = "Bebas"
  }
}

const projectsLoader = (projects) => {
  let worksSection = document.querySelector('.work')
  projects.forEach(project => {
    createNewProject(project, worksSection)
  })
}

const createNewProject = ({name, started_at, finished_at, details, links}, workSection) => {
  let projectContainer = document.createElement('figure')
  projectContainer.classList.add('project')
  projectContainer.innerHTML = `
  <header>${name} <small>${(finished_at != null) ? `${finished_at} `: `${started_at} — Present` }</small></header>
  <figcaption>
    <div class="description-area">
      <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
      <p>${details}</p>
    </div>
    <div class="more-links">
      ${(links) ? `
      <a href="${links[0]}" target="_blank" class="sourcecode">sourcecode</a>
      <a href="${links[1]}" target="_blank" class="sourcecode">live-demo</a>
      ` : `
      <a href="#" disabled class="sourcecode">sourcecode</a>
      <a href="#" disabled class="sourcecode">live-demo</a>
      `}
    </div>
  </figcaption>
  `
  workSection.appendChild(projectContainer)
}

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
let replaceMonth = document.querySelector("#month")
let currentMonth = currentDate.getMonth()
replaceMonth.textContent = months[currentMonth]

// End Line
console.group("Emptywork -- Dev")
console.log(
  "%cEmptywork %c console",
  "background-color:#cecece; margin:2px; color:transparent; font-size:0.7rem"
)
console.log(
  "%cdot one %c com",
  "background-color:rebeccapurple; margin:2px; color:transparent; font-size:0.7rem"
)
console.log("%cemptywork dot github dot io", "font-size:1rem")
console.log(
  "%cEmptywork Console %c testing",
  "background-color:#cecece; margin:2px; color:transparent; font-size:0.7rem"
)
console.groupEnd()

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
  let worksSection = document.querySelector('.projects')
  projects.forEach(project => {
    createNewProject(project, worksSection)
  })
}

const createNewProject = ({name, started_at, finished_at, details, links, image}, workSection) => {
  let projectLink = document.createElement('a');
  projectLink.href = "#projects";
  projectLink.setAttribute('arial-label', `Project: ${name}`)
  let projectContainer = document.createElement('figure')
  projectContainer.classList.add('project')
  if(image)projectContainer.style.backgroundImage = `linear-gradient(transparent, var(--clr-accent-dark)), url(${image})`;
  projectContainer.innerHTML = `
  <figcaption>
    <header>
      <h2>${name}</h2> 
      <small>${(finished_at != null) ? `${finished_at} `: `${started_at} — Present` }</small>
    </header>
    <article class="description-area">
      <p>${details}</p>
    </article>
    <ul class="more-links">
    ${(links) ? `
      <li><a href="${links[0]}" target="_blank" class="sourcecode">sourcecode</a></li>
      <li><a href="${links[1]}" target="_blank" class="sourcecode">live-demo</a></li>
      ` : `
      <li><a href="#projects" disabled class="sourcecode">sourcecode</a></li>
      <li><a href="#projects" disabled class="sourcecode">live-demo</a></li>
      `}
    </ul>
    </figcaption>
    `
  projectLink.appendChild(projectContainer)
  workSection.appendChild(projectLink)
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
console.log("%cemptywork dot github dot io", "font-size:0.88rem")
console.log(
  "%cEmptywork Console %c testing",
  "background-color:#cecece; margin:2px; color:transparent; font-size:0.7rem"
)
console.groupEnd()

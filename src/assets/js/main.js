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

dataLoader('/settings.json')

const schemeLoader = (scheme) => {
  localStorage.scheme = scheme
}

/**
 * Mobile hamburger menu logic
 */
const mobileButtons = document.querySelectorAll('[data-mobile-menu-button]')
const mobileMenuSection = document.querySelector('[data-mobile-menu-section]')
const mobileMenuLinks = document.querySelectorAll('body>ul>li')
const documentBody = document.body

mobileButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!mobileMenuSection.classList.contains('not-showing')) return setHidden()
    return setShowing()
  })
})

const setShowing = () => {
  mobileButtons[0].setAttribute('aria-label', 'Close the mobile menu')
  mobileButtons[0].setAttribute('aria-expanded', 'true')
  mobileMenuSection.setAttribute('aria-hidden', 'false')
  mobileMenuSection.classList.remove('not-showing')
  setTimeout(() => documentBody.classList.add('no-scroll'), 300)
}

const setHidden = () => {
  mobileButtons[0].setAttribute('aria-label', 'Open the mobile menu')
  mobileButtons[0].setAttribute('aria-expanded', 'false')
  mobileMenuSection.setAttribute('aria-hidden', 'true')
  mobileMenuSection.classList.add('not-showing')
  documentBody.classList.remove('no-scroll')
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
const themesButton = document.querySelector('[data-theme-button]')

const themeHandler = () => {
  if (document.documentElement.dataset.theme !== "dark") return setDark()
  return setLight()
}

themesButton?.addEventListener('click', themeHandler)

const setLight = () => {
  document.documentElement.dataset.theme = "light"
  themesButton.setAttribute('aria-label', 'Switch to dark mode')
  localStorage.theme = 'light'
}

const setDark = () => {
  document.documentElement.dataset.theme = "dark"
  themesButton.setAttribute('aria-label', 'Switch to light mode')
  localStorage.theme = 'dark'
}

/**
 * Printing details on console
 */

console.log(
  "%cEmptywork Console%c\nemptywork dot github dot io%c\n emptywork dot github dot io%c\nEnd of Console%c\n NOTE %c DON'T COPY ANY CODE INTO HERE",
  'background-color:#cecece; margin: 0.15em; padding: 0.1em; border-radius: 0.2em; color:transparent; font-size:1rem',
  'background-color:rebeccapurple; margin: 0.15em; padding: 0.1em; border-radius: 0.2em; color:transparent; font-size:1rem',
  'font-size:1.2rem',
  'background-color:#cecece; margin: 0.15em; padding: 0.1em; border-radius: 0.2em; color:transparent; font-size:1rem',
  'background-color:rebeccapurple; margin: 0.15em; padding: 0.1em; border-radius: 0.2em; font-size:1rem',
  'color: rebeccapurple; font-size: 1.1rem'
)

/**
 * Global Variables for Date related functions
 */
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const months = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const replaceStatus = document.querySelector('#activity')
const replaceMonth = document.querySelector('#month')
const replaceYear = document.querySelector('#year')

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

  if (replaceStatus) replaceStatus.textContent = 'Idle'

  setTimeout(() => {
    schedules.forEach(schedule => {
      let { day, endHour, startHour } = schedule
      if (!replaceStatus) return
      if (days[currentDay] === toCapitalizeWord(day)) {
        if (currentTime > startHour && currentTime < endHour) {
          replaceStatus.textContent = 'Studying'
        }
        return
      }
      replaceStatus.textContent = 'Idle'
    })
  }, 0)
}

// Injecting #main to main that doesn't have #main
const mainElement =
  document.querySelector('#main') ?? document.querySelector('.main')
mainElement.id = 'main'

/**
 * Preload
 */

const preloadElement = document.querySelector('.preload')
const delayElements = document.querySelectorAll('[data-delay]')

delayElements?.forEach(
  (el) => {
    let delayModifier = 0
    const parentElement = el.parentElement
    const getAmountOfDelayElems = parentElement.querySelectorAll('[data-delay]').length
    if (!parentElement.hasAttribute("data-delay-parent")) parentElement.setAttribute('data-delay-parent', true)
    delayModifier = getAmountOfDelayElems

    el.setAttribute("data-transition-delay", `${parseInt(el.dataset.delay) * 50 * (delayModifier / 2)}ms`)
  }
)

const observer = new IntersectionObserver((entires) =>
  entires.forEach((entry) => {
    if (entry.isIntersecting)
      return entry.target.setAttribute('data-has-been-animated', true)
    return entry.target.removeAttribute('data-has-been-animated')
  })
)

const toBeAnimateElements = document.querySelectorAll('[data-animation]')

const removeElementAnimated = ({ timeout, targetElement }) => {
  const timeoutDelay = timeout + timeout * 1.5
  setTimeout(() => targetElement?.classList.add('hidden'), timeout)
  setTimeout(() => targetElement?.classList.add('disabled'), timeoutDelay)
  setTimeout(
    () => toBeAnimateElements?.forEach((el) => observer.observe(el)),
    timeout
  )
}

const loadedDocumentBody = () => {
  if (!documentBody.classList.contains('not-loaded')) return
  removeElementAnimated({
    targetElement: preloadElement,
    timeout: 1000,
  })
  documentBody.classList.remove('not-loaded')
}

window.addEventListener('load', loadedDocumentBody, false)

const makeExternalWarningForExternalLink = (parentElement) => {
  const warningElement = document.createElement('span')
  warningElement.classList.add('new-tab-warning')
  warningElement.textContent = 'Open a new tab'
  parentElement.appendChild(warningElement)
}

const makeA11yExternalLink = (externalLink) => {
  const linkWarning = externalLink.querySelector('.new-tab-warning')
  if (linkWarning) return
  return makeExternalWarningForExternalLink(externalLink)
}

for (const externalLink of document.querySelectorAll('[target=_blank]')) {
  makeA11yExternalLink(externalLink)
}

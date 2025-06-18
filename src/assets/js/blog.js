const checkTableOfContents = () => {
    const toc = document.getElementById("main").querySelector(".table-of-contents")
    const skipToMain = document.querySelector('a[href="#main"]')
    const navSkip = document.querySelector(".nav-skip")
    if (!toc) return

    let nextCandidate = toc?.nextElementSibling
    nextCandidate.id = "pass-toc"

    const skipLink = createSkipLink(nextCandidate.id)
    navSkip.insertBefore(skipLink, skipToMain.nextSibling)
}

const createSkipLink = (id, text = "Skip pass the Table of Contents") => {
    const skipLink = document.createElement('a')
    skipLink.className = 'nav-skipto'
    skipLink.href = `#${id}`
    skipLink.innerText = text
    return skipLink
}

checkTableOfContents()
Array.from(document.links).filter(link => link.hostname != window.location.hostname)
    .forEach(link => link.target = '_blank')

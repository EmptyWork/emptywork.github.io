const keyboardSymbols = {
    CTRL: '⌃',
    CONTROL: '⌃',
    SHIFT: '⇧',
    ALT: '⎇',
    META: '⌘',
    ENTER: '⏎',
    ESC: '⎋',
    TAB: '⇥',
    BACKSPACE: '⌫',
    DELETE: '⌦',
    ARROWUP: '↑',
    ARROWDOWN: '↓',
    ARROWLEFT: '←',
    ARROWRIGHT: '→',
    PAGEUP: '⇞',
    PAGEDOWN: '⇟',
    HOME: '↖',
    END: '↘',
    SPACE: '␣'
}

document.querySelectorAll('kbd').forEach(kbd => {
    let gotSymbol = false
    const originalText = kbd.innerHTML
    const text = originalText.split(" ")
    // console.log(text)
    const newText = text.map(text => {
        text = text.trim()
        if (keyboardSymbols[text.toUpperCase()]) {
            text = keyboardSymbols[text.toUpperCase()]
            gotSymbol = true
        }
        return text
    })
    if (!gotSymbol) return kbd.innerHTML = originalText
    kbd.innerHTML = newText.join(" ")
    kbd.setAttribute('aria-label', `Keyboard shortcut: ${originalText}`)
})

const getCodeType = pre => {
    if (!pre.firstChild && !pre.firstChild.classList) return null
    return Array.from(pre.firstChild.classList).find(cls => cls.startsWith('language-'))
}

const createToolsContainer = (language, codeContent) => {
    const toolsContainer = document.createElement('div')
    const pre = codeContent?.parentElement
    const parentOfPre = pre?.parentElement
    let expandButton = null
    let ariaLabel = pre?.getAttribute('aria-label') || 'Code block'

    const codeTypeDiv = createTypeDiv(language)
    const copyButton = createCopyButton(codeContent)
    if (parentOfPre.nodeName.toLowerCase() !== "blockquote") {
        expandButton = createExpandButton(toolsContainer)
    }

    toolsContainer.className = 'tools-container'
    ariaLabel += `, ${copyButton.getAttribute('aria-label')}`

    toolsContainer.appendChild(codeTypeDiv)
    toolsContainer.appendChild(copyButton)
    if (expandButton) {
        toolsContainer.appendChild(expandButton)
        ariaLabel += `, ${expandButton.getAttribute('aria-label')}`
    }

    pre.setAttribute('aria-label', ariaLabel)
    return toolsContainer
}

const createExpandablePre = (pre) => {
    pre.className = 'expandable'
    pre.setAttribute('tabindex', '0')
    pre.setAttribute('role', 'region')
    pre.addEventListener('keydown', (event) => {
        const expandOption = pre.querySelector('#expand-option')
        if (event.key === 'Enter') {
            if (!expandOption) return
            if (event.target.id === 'copy-option') return
            event.currentTarget.classList.toggle('expanded')
            pre.querySelector('#expand-option').firstChild.innerText =
                pre.classList.contains('expanded') ? 'Collapse' : 'Expand'
        }

        if (event.key === 'c' && event.ctrlKey) {
            const copyButton = pre.querySelector('#copy-option')
            if (copyButton) copyButton.click()
        }
    })
    return pre
}

const createExpandButton = (container) => {
    const expandButton = createInteractiveButton({
        text: 'Expand',
        id: 'expand-option',
        label: 'Press Enter to expand code block or collapse it',
        defaultState: false,
    })
    const shortcut = createKeyboardShortcut({
        keyCode: 'Enter',
    })

    expandButton.addEventListener('click', () => {
        if (!container.parentElement.classList.contains('expanded')) {
            container.parentElement.classList.add('expanded')
            expandButton.firstChild.innerText = 'Collapse'
            expandButton.setAttribute('aria-pressed', 'true')
        } else {
            container.parentElement.classList.remove('expanded')
            expandButton.firstChild.innerText = 'Expand'
            expandButton.setAttribute('aria-pressed', 'false')
        }
    })

    expandButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.currentTarget.click()
        }
    })

    expandButton.appendChild(shortcut)

    return expandButton
}

const createTypeDiv = language => {
    const typeDiv = document.createElement('div')
    typeDiv.className = 'code-type'
    typeDiv.innerText = language || 'Code'
    return typeDiv
}

const createCopyButton = codeContent => {
    const shortcut = createKeyboardShortcut({
        keyCode: 'c',
        keyModifier: 'Ctrl'
    })
    const copyButton = createInteractiveButton({
        text: 'Copy',
        id: 'copy-option',
        label: 'Press Control + C to copy code to clipboard',
        defaultState: false,
    })

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(codeContent.textContent)
            .then(() => {
                copyButton.firstChild.innerText = 'Copied!'
                setTimeout(() => {
                    copyButton.firstChild.innerText = 'Copy'
                }, 2000)
            })
            .catch(err => {
                console.error('Failed to copy text: ', err)
                copyButton.firstChild.innerText = 'Error'
            })
    })
    copyButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            copyButton.click()
        }
    })

    copyButton.appendChild(shortcut)

    return copyButton
}

const createKeyboardShortcut = ({ keyCode, keyModifier }) => {
    const shortcut = document.createElement('kbd')
    const keyCodeElement = document.createElement('span')
    let keyModifierElement

    switch (keyModifier) {
        case 'Ctrl':
            keyModifierElement = createKeyboardModifier({
                keyboardSymbol: getKeyboardCode("Ctrl"),
                keyboardModifier: 'Control'
            })
            break;
        case 'Shift':
            keyModifierElement = createKeyboardModifier({
                keyboardSymbol: getKeyboardCode("Shift"),
                keyboardModifier: 'Shift'
            })
            break;
    }

    keyCodeElement.className = 'key-code'
    keyCodeElement.innerText = getKeyboardCode(keyCode)

    shortcut.className = 'keyboard-shortcut'
    if (keyModifier) shortcut.appendChild(keyModifierElement)
    shortcut.appendChild(keyCodeElement)
    return shortcut
}

const getKeyboardCode = (text) => {
    return keyboardSymbols[text.toUpperCase()] || text
}

const createKeyboardModifier = ({ keyboardSymbol, keyboardModifier }) => {
    const keyModifierElement = document.createElement('span')
    const keyModifierText = document.createElement('span')
    const keyModifierSymbol = document.createElement('span')

    keyModifierElement.className = 'key-modifier'

    keyModifierText.innerText = keyboardModifier ?? 'Control'
    keyModifierText.className = 'sr-only'

    keyModifierSymbol.innerText = keyboardSymbol ?? '⌃'
    keyModifierSymbol.ariaHidden = true

    keyModifierElement.appendChild(keyModifierText)
    keyModifierElement.appendChild(keyModifierSymbol)

    return keyModifierElement
}

const createInteractiveButton = ({ text, id, label, defaultState } = {}) => {
    const button = document.createElement('button')
    const buttonText = document.createElement('span')
    buttonText.innerText = text || 'Button'
    button.id = id || 'interactive-button'
    button.setAttribute('aria-label', label || 'Interactive button')
    button.setAttribute('aria-pressed', defaultState ? 'true' : 'false')
    button.appendChild(buttonText)
    return button
}

const enhancePreElement = pre => {
    const codeType = getCodeType(pre)
    if (codeType) pre.setAttribute('data-language', codeType.replace('language-', ''))

    const codeContent = pre.querySelector('code')
    const language = pre.getAttribute('data-language')
    const toolsContainer = createToolsContainer(language, codeContent)

    createExpandablePre(pre)
    pre.insertBefore(toolsContainer, pre.firstChild)
}

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

document.querySelectorAll('pre').forEach(enhancePreElement)
checkTableOfContents()
Array.from(document.links).filter(link => link.hostname != window.location.hostname)
    .forEach(link => link.target = '_blank')

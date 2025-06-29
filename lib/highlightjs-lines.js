/**
 * This will convert every lines that is not
 * starts with - or + (diff-support) to be encase 
 * inside a div with the class of hljs-line
 * 
 * @param {*} hljs 
 * @returns 
 */

export default function (hljs) {
    function highlight(code, options) {
        const result = hljs.highlight(code, { ...options, language: options.language })
        const lines = result.value.split('\n')

        const processedLines = lines.map(line => {
            const hasAddition = line.startsWith(`<span class="hljs-addition">+`)
            const hasDeletion = line.startsWith(`<span class="hljs-deletion">-`)
            const isEmpty = line === ""
            let outputLine = line.replace("+ ", "<span class='hljs-indicator'>+</span>").replace("- ", "<span class='hljs-indicator'>-</span>");
            if (!isEmpty && !hasAddition && !hasDeletion) {
                outputLine = `<span class="hljs-line">${line}</span>`
            }

            return outputLine
        }).join('\n')

        return {
            ...result,
            code,
            value: processedLines,
            language: options.language
        }
    }

    return {
        ...hljs,
        highlight(codeOrLanguageName, optionsOrCode, ignoreIllegals = false) {
            return typeof optionsOrCode === 'string'
                ? highlight(optionsOrCode, { language: codeOrLanguageName, ignoreIllegals })
                : highlight(codeOrLanguageName, optionsOrCode)
        }
    }
}
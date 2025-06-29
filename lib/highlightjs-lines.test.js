import highlight from "highlight.js"
import highlightjsLines from "./highlightjs-lines.js"
import highlightDiff from "highlightjs-code-diff"
import markdownIt from "markdown-it"
import { describe, it } from 'node:test'
import assert from "node:assert"

const hljsLinesWithDiff = highlightjsLines(highlightDiff(highlight))
const hljsLines = highlightjsLines(highlight)

describe('Highlight Lines using Markdown With Diff', () => {
    const mIt = markdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
            if (lang) {
                try {
                    return hljsLinesWithDiff.highlight(str, { language: lang }).value
                } catch (__) { }
            }
            return ""
        }
    })
    it('Test With Diff (Deletion)', () => {
        const data = `
\`\`\`diff:js
- setTimeout(() => throw new Error(),0)
\`\`\`
`
        const value = mIt.render(data)
        assert.strictEqual(value, `<pre><code class="language-diff:js"><span class="hljs-deletion"><span class='hljs-indicator'>-</span><span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(),<span class="hljs-number">0</span>)</span>\n</code></pre>\n`)
    })
    it('Test With Diff (Addition)', () => {
        const data = `
\`\`\`diff:js
+ setTimeout(() => throw new Error(),0)
\`\`\`
`
        const value = mIt.render(data)
        assert.strictEqual(value, `<pre><code class="language-diff:js"><span class="hljs-addition"><span class='hljs-indicator'>+</span><span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Error</span>(),<span class="hljs-number">0</span>)</span>\n</code></pre>\n`)
    })
    it('Normal Test', () => {
        const data = `
\`\`\`js
let time = new Date()
\`\`\`
`
        const value = mIt.render(data)
        assert.strictEqual(value, `<pre><code class="language-js"><span class="hljs-line"><span class="hljs-keyword">let</span> time = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Date</span>()</span>\n</code></pre>\n`)
    })
})

describe("Highlight Lines with Diff", async (t) => {
    it("Test With Diff (Deletion)", () => {
        const code = ` function helloWorld () {
-  return 'Hello'
 }
`
        const { value } = hljsLinesWithDiff.highlight(code, { language: 'diff:js' })
        assert.strictEqual(value, `<span class="hljs-line"> <span class="hljs-keyword">function</span> <span class="hljs-title function_">helloWorld</span> (<span class="hljs-params"></span>) {</span>
<span class="hljs-deletion"><span class='hljs-indicator'>-</span> <span class="hljs-keyword">return</span> <span class="hljs-string">&#x27;Hello&#x27;</span></span>
<span class="hljs-line"> }</span>\n`)
    })
    it("Test With Diff (Addition)", () => {
        const code = ` function helloWorld () {
+  return 'Hello, world!'
 }
`
        const { value } = hljsLinesWithDiff.highlight(code, { language: 'diff:js' })
        assert.strictEqual(value, `<span class="hljs-line"> <span class="hljs-keyword">function</span> <span class="hljs-title function_">helloWorld</span> (<span class="hljs-params"></span>) {</span>
<span class="hljs-addition"><span class='hljs-indicator'>+</span> <span class="hljs-keyword">return</span> <span class="hljs-string">&#x27;Hello, world!&#x27;</span></span>
<span class="hljs-line"> }</span>\n`)
    })
    it("Normal Test", () => {
        const code = ` function helloWorld () {
   return 'Hello'
   return 'Hello, world!'
 }
`
        const { value } = hljsLinesWithDiff.highlight(code, { language: 'diff:js' })
        assert.strictEqual(value, `<span class="hljs-line"> <span class="hljs-keyword">function</span> <span class="hljs-title function_">helloWorld</span> (<span class="hljs-params"></span>) {</span>
<span class="hljs-line">   <span class="hljs-keyword">return</span> <span class="hljs-string">&#x27;Hello&#x27;</span></span>
<span class="hljs-line">   <span class="hljs-keyword">return</span> <span class="hljs-string">&#x27;Hello, world!&#x27;</span></span>
<span class="hljs-line"> }</span>\n`)
    })
})

describe("Highlight Lines", async (t) => {
    it("Test With Diff (Deletion)", () => {
        const code = ` function helloWorld () {
-  return 'Hello'
 }
`
        const { value } = hljsLines.highlight(code, { language: 'js' })
        assert.strictEqual(value, `<span class="hljs-line"> <span class="hljs-keyword">function</span> <span class="hljs-title function_">helloWorld</span> (<span class="hljs-params"></span>) {</span>
<span class="hljs-line">-  <span class="hljs-keyword">return</span> <span class="hljs-string">&#x27;Hello&#x27;</span></span>
<span class="hljs-line"> }</span>\n`)
    })
    it("Test With Diff (Addition)", () => {
        const code = ` function helloWorld () {
+  return 'Hello, world!'
 }
`
        const { value } = hljsLines.highlight(code, { language: 'js' })
        assert.strictEqual(value, `<span class="hljs-line"> <span class="hljs-keyword">function</span> <span class="hljs-title function_">helloWorld</span> (<span class="hljs-params"></span>) {</span>
<span class="hljs-line">+  <span class="hljs-keyword">return</span> <span class="hljs-string">&#x27;Hello, world!&#x27;</span></span>
<span class="hljs-line"> }</span>\n`)
    })
    it("Normal Test", () => {
        const code = ` function helloWorld () {
   return 'Hello'
   return 'Hello, world!'
 }
`
        const { value } = hljsLines.highlight(code, { language: 'js' })
        assert.strictEqual(value, `<span class="hljs-line"> <span class="hljs-keyword">function</span> <span class="hljs-title function_">helloWorld</span> (<span class="hljs-params"></span>) {</span>
<span class="hljs-line">   <span class="hljs-keyword">return</span> <span class="hljs-string">&#x27;Hello&#x27;</span></span>
<span class="hljs-line">   <span class="hljs-keyword">return</span> <span class="hljs-string">&#x27;Hello, world!&#x27;</span></span>
<span class="hljs-line"> }</span>\n`)
    })
})
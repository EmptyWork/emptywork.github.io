module.exports = function (eleventyConfig) {
  const { DateTime } = require("luxon")
  const hljs = require("highlight.js")
  const anchor = require("markdown-it-anchor")
  const markdownItAttrs = require("markdown-it-attrs")
  const markdownIt = require("markdown-it")({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value
        } catch (__) {}
      }

      return ""
    },
  })
    .use(anchor, {
      permalink: anchor.permalink.ariaHidden({
        placement: "before",
      }),
    })
    .use(markdownItAttrs, {
      leftDelimiter: "{",
      rightDelimiter: "}",
      allowedAttributes: [],
    })
    .use(require("markdown-it-table-of-contents"), {
      includeLevel: [1, 2, 3, 4, 5, 6],
      containerHeaderHtml: `<div class="toc-container-header">Table of Contents</div>`,
    })

  eleventyConfig.setLibrary("md", markdownIt)
  eleventyConfig.addPassthroughCopy("./src/assets/*")
  eleventyConfig.addPassthroughCopy("./src/js/*")
  eleventyConfig.addPassthroughCopy("./src/admin/*")
  eleventyConfig.addPassthroughCopy("./src/images/*")
  eleventyConfig.addPassthroughCopy("./settings.json")

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })

  eleventyConfig.addFilter("reverseGroupedPosts", (object) => {
    return Object.entries(object).sort((a, b) => b[0] - a[0])
  })

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    let date = new Date(dateObj);
    return date.toISOString()
  })

  eleventyConfig.addFilter("postYear", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString({ year: "numeric" })
  })

  eleventyConfig.addFilter("sliceRecent", (array) => {
    return array.slice(0, 3)
  })

  eleventyConfig.addFilter("trimText", (string) => {
    return string.split(" ").splice(0, 12).join(" ")
  })

  eleventyConfig.addFilter("markdownToHTML", (text) => {
    return markdownIt.render(text)
  })

  eleventyConfig.addFilter("featuredDate", (string) => {
    let date = new Date(string)
    console.log(date.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"}))
    return date.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})
  })

  return {
    templateFormats: ["md", "njk", "html", "liquid"],

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      data: "_data",
      input: "src",
      output: "public",
    },
  }
}

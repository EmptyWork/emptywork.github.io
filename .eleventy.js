
module.exports = function(eleventyConfig) {
  const {DateTime} = require('luxon')
  const hljs = require('highlight.js')
  const markdownIt = require('markdown-it')({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value
          } catch (__) {}
        }
  
        return ''
      }
    }
  )
  .use(require('markdown-it-anchor').default)
  .use(require('markdown-it-table-of-contents'), {
    includeLevel: [1,2,3,4,5,6],
    containerHeaderHtml: `<div class="toc-container-header">Table of Contents</div>`
  });

  eleventyConfig.setLibrary("md", markdownIt)
  eleventyConfig.addPassthroughCopy("./src/assets/*")
  eleventyConfig.addPassthroughCopy("./src/js/*")
  eleventyConfig.addPassthroughCopy("./src/admin/*")
  eleventyConfig.addPassthroughCopy("./src/css/style.css")
  eleventyConfig.addPassthroughCopy("./src/images/*")
  eleventyConfig.addPassthroughCopy("./settings.json")
  
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })

  eleventyConfig.addFilter("postYear", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString({year: 'numeric'})
  })
  
  return {
    dir: {
      input: "src",
      output: "public",
    }
  }
}
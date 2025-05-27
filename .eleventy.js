const pluginRss = require('@11ty/eleventy-plugin-rss')
require('dotenv').config()

module.exports = function (eleventyConfig) {
  const { DateTime } = require('luxon')
  const hljs = require('highlight.js')
  const anchor = require('markdown-it-anchor')
  const markdownIt = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang))
        try {
          return hljs.highlight(str, { language: lang }).value
        } catch (__) { }

      return ''
    },
  })
    .use(anchor, {
      permalink: anchor.permalink.ariaHidden({
        placement: 'before',
      }),
    })
    .use(require('markdown-it-bracketed-spans'))
    .use(require('markdown-it-attrs'), {
      leftDelimiter: '{',
      rightDelimiter: '}',
      allowedAttributes: [],
    })
    .use(require('markdown-it-table-of-contents'), {
      includeLevel: [1, 2, 3, 4, 5, 6],
      containerHeaderHtml: `<div class="toc-container-header">Table of Contents</div>`,
    })
    .use(require('markdown-it-mark'))

  eleventyConfig.setLibrary('md', markdownIt)

  const isDevelopment = process.env.NODE_ENV === 'development';
  eleventyConfig.addGlobalData("isDevelopment", isDevelopment);

  eleventyConfig.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default',
    },
  })

  eleventyConfig.addPassthroughCopy('src/assets/*.pdf')
  eleventyConfig.addPassthroughCopy({ 'src/assets/js/*': 'js' })
  eleventyConfig.addPassthroughCopy({ 'src/assets/images': 'images' })

  eleventyConfig.addPassthroughCopy('src/admin/*')
  eleventyConfig.addPassthroughCopy('settings.json')
  eleventyConfig.addPassthroughCopy('src/robots.txt')

  eleventyConfig.addFilter('postDate', (dateObj) => {
    if (typeof (dateObj) !== 'object') dateObj = new Date(dateObj)
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })

  eleventyConfig.addFilter('reverseGroupedPosts', (object) => {
    return Object.entries(object).sort((a, b) => b[0] - a[0])
  })

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    let date = new Date(dateObj)
    return date.toISOString()
  })

  eleventyConfig.addFilter('postYear', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString({ year: 'numeric' })
  })

  eleventyConfig.addFilter('sliceRecent', (array) => {
    return array.slice(0, 3)
  })

  eleventyConfig.addFilter('trimText', (string) => {
    return string.split(' ').splice(0, 12).join(' ')
  })

  eleventyConfig.addFilter('cutText', (string, size) => {
    return string.split('-').splice(0, size).join('-')
  })

  eleventyConfig.addFilter('serializeTitle', (string, yearSplice = 2) => {
    const titleParts = string.split('-')
    const [year, ...title] = titleParts
    const titleInitials = title.map(title => title.split('')[0]).join('')
    const yearSuffix = year.slice(-yearSplice)

    return `${yearSuffix}-${titleInitials}`
  })

  eleventyConfig.addFilter("development", (link) => {
    console.log(isDevelopment)
    return isDevelopment ? "/" : link;
  });

  eleventyConfig.addFilter('breakLine', (string, cutAt = 3, maxSize = 30) => {
    const titleWords = string.split(' ')
    const titleLength = string.length
    const titlePreview = titleWords.slice(0, cutAt).join(" ")
    const titleRemaining = titleWords.slice(cutAt).join(" ")

    const hasTitleRemaining = !!titleRemaining
    const formattedTitleWithBreak = hasTitleRemaining ? `${titlePreview}<br/>${titleRemaining}` : titlePreview

    const returnTitle = titleLength <= maxSize || !hasTitleRemaining ? string : formattedTitleWithBreak
    return returnTitle
  })

  eleventyConfig.addFilter('renderMarkdown', (text) => {
    return markdownIt.render(text)
  })

  eleventyConfig.addFilter('renderMarkdownInline', (text) => {
    return markdownIt.renderInline(text)
  })

  eleventyConfig.addFilter('featuredDate', (string) => {
    let date = new Date(string)
    return date.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  })

  return {
    templateFormats: ['md', 'njk', 'html', 'liquid'],

    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    dir: {
      data: '_data',
      input: 'src',
      output: 'public',
    },
  }
}

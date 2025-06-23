import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import { DateTime } from "luxon"
import hljs from "highlight.js"
import markdownIt from "markdown-it"
import anchor from "markdown-it-anchor"
import bracketedSpans from "markdown-it-bracketed-spans"
import attrs from "markdown-it-attrs"
import toc from "markdown-it-table-of-contents"
import mark from "markdown-it-mark"
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img"
import rssPlugin from "@11ty/eleventy-plugin-rss"

dotenv.config()

export default function (eleventyConfig) {
  const isDevelopment = process.env.NODE_ENV === "development"
  const markdownItConfig = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value
        } catch (__) { }
      }
      return ""
    },
  })
    .use(anchor, {
      permalink: anchor.permalink.linkAfterHeader({
        style: "visually-hidden",
        assistiveText: (title) => `Link to heading “${title}”`,
        visuallyHiddenClass: "sr-only",
        wrapper: ['<div class="header-wrapper">', '</div>'],
      }),
    })
    .use(bracketedSpans)
    .use(attrs, {
      leftDelimiter: "{",
      rightDelimiter: "}",
      allowedAttributes: [],
    })
    .use(toc, {
      includeLevel: [1, 2, 3],
      containerHeaderHtml: `<div class="toc-container-header">Table of Contents</div>`,
    })
    .use(mark)

  eleventyConfig.setLibrary("md", markdownItConfig)
  eleventyConfig.addGlobalData("isDevelopment", isDevelopment)

  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: "default",
    },
  })

  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  eleventyConfig.addPassthroughCopy({
    "src/assets/*.pdf": "assets",
    "src/assets/images": "images",
    "src/admin/*": "admin",
    "settings.json": "settings.json",
    "src/robots.txt": "robots.txt",
    "src/*.xsl": "/"
  })

  if (isDevelopment) {
    eleventyConfig.addPassthroughCopy({
      "src/assets/js": "js",
    })
  }

  eleventyConfig.addFilter("postDate", (dateObj) => {
    if (typeof dateObj !== "object") dateObj = new Date(dateObj)
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  })

  eleventyConfig.addFilter("reverseGroupedPosts", (object) =>
    Object.entries(object).sort((a, b) => b[0] - a[0])
  )

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    let date = new Date(dateObj)
    return date.toISOString()
  })

  eleventyConfig.addFilter("postYear", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString({ year: "numeric" })
  })

  eleventyConfig.addFilter("sliceRecent", (array) => {
    return array.slice(0, 3)
  })

  eleventyConfig.addFilter("clipText", (string, size = 12, separator = "-") => {
    return string.split(separator).splice(0, size).join(separator)
  })

  eleventyConfig.addFilter("serializeTitle", (string, yearSplice = 2) => {
    const titleParts = string.split("-")
    const [year, ...title] = titleParts
    const titleInitials = title.map((title) => title.split("")[0]).join("")
    const yearSuffix = year.slice(-yearSplice)

    return `${yearSuffix}-${titleInitials}`
  })

  eleventyConfig.addFilter("development", (link) => {
    return isDevelopment ? "/" : link
  })

  eleventyConfig.addFilter("breakLine", (string, cutAt = 3, maxSize = 30) => {
    const titleWords = string.split(" ")
    const titleLength = string.length
    const titlePreview = titleWords.slice(0, cutAt).join(" ")
    const titleRemaining = titleWords.slice(cutAt).join(" ")

    const hasTitleRemaining = !!titleRemaining
    const formattedTitleWithBreak = hasTitleRemaining
      ? `${titlePreview}<br/>${titleRemaining}`
      : titlePreview

    return titleLength <= maxSize || !hasTitleRemaining
      ? string
      : formattedTitleWithBreak
  })

  eleventyConfig.addFilter("svg", (fileName, index) => {
    const filePath = path.join(process.cwd(), "src/assets/svg", fileName)
    try {
      let svgContent = fs.readFileSync(filePath, "utf8")
      if (index) {
        svgContent = svgContent.replace(
          "<svg",
          `<svg data-animation="fade-in" data-delay=${index}`
        )
      }
      return svgContent
    } catch (error) {
      return `<!-- SVG ${fileName} not found -->`
    }
  })

  eleventyConfig.addFilter("renderMarkdown", (text) => {
    return markdownItConfig.render(text)
  })

  eleventyConfig.addFilter("renderMarkdownInline", (text) => {
    return markdownItConfig.renderInline(text)
  })

  eleventyConfig.addFilter("featuredDate", (string) => {
    let date = new Date(string)
    return date.toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
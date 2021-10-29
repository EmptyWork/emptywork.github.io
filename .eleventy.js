const {DateTime} = require('luxon');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/assets/*")
  eleventyConfig.addPassthroughCopy("./src/js/*")
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
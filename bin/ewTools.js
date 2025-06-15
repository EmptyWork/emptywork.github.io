import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config()
const isDevelopment = process.env.TOOLS_ENV === "development"
const LoggerType = Object.freeze({
    INFO: "Info",
    WARN: "Warning",
    ERROR: "Error",
    EMPTY: ""
})

const getAllActionTypes = () => Object.values(ActionTypes).map((action, index, arr) => (index === arr.length - 1 ? ` and \`${action}\`` : ` \`${action}\`,`)).join("")

const getAllEntityTypes = () => Object.values(EntityTypes).map((entity, index, arr) => (index === arr.length - 1 ? ` and \`${entity}\`` : ` \`${entity}\`,`)).join("")

function Logger(text, type = LoggerType.EMPTY) {
    const typeFormatted = (type === LoggerType.EMPTY) ? `${type}` : `${type}:`
    if (isDevelopment) console.log(`${typeFormatted}`, text)
}

const formatFlagsString = (args) => {
    if (!Array.isArray(args) || args.length === 0) return "";

    return args.map((token, index) => {
        if (index === args.length - 1) return token;
        return (index % 2 == 0) ? `${token};` : `${token}+`
    }).join("")
}

const flagsHandler = (flags) => {
    const paramWithValue = flags.split("+")
    const flagsObject = new Object();
    paramWithValue.forEach(token => {
        const [attr, value] = token.split(";")
        flagsObject[attr[1]] = value
    })
    return flagsObject
}

const args = process.argv.slice(2)
if (args.length <= 0) {
    console.log("Usage: ./ewtools.bat make:blog \"title\"")
    process.exit()
}
const [command, title, ...restArgs] = args
const [action, type] = command.split(':')
const formattedFlags = formatFlagsString(restArgs)
const flagsObject = flagsHandler(formattedFlags)
Logger(args, LoggerType.INFO)
Logger(flagsObject, LoggerType.INFO)

const ActionTypes = Object.freeze({
    MAKE: "make",
    DELETE: "delete",
    REMOVE: "remove"
})

const EntityTypes = Object.freeze({
    BLOG: "blog",
    PROJECT: "project",
    PROTOTYPE: "prototype"
})

if (args.length < 2) {
    console.log("Usage: ./ewtools.bat make:blog \"title\"")
    process.exit(1)
}

const handleError = (error, filename, action = ActionTypes.MAKE) => {
    if (error) return console.error(`Error creating file: ${error.message}`)
    const currentAction = (action === ActionTypes.MAKE) ? "created" : "removed"
    console.log(`File "${filename}" ${currentAction} successfully.`)
}

const generateFile = (title, entityType, getContent) => {
    const { filename, filepath } = generateFilePath(title, entityType);
    const content = getContent(title, flagsObject);
    fs.writeFile(filepath, content, error => handleError(error, filename));
};

const generateBlogFile = (title) => generateFile(title, EntityTypes.BLOG, getDefaultBlogContent)

const generateProjectFile = (title) => generateFile(title, EntityTypes.PROJECT, getDefaultProjectContent)

const generatePrototypeFile = (title) => generateFile(title, EntityTypes.PROTOTYPE, getDefaultPrototypeContent)

const removeFile = (title, type) => {
    const { filename, filepath } = generateFilePath(title, type)
    fs.rm(filepath, (error) => handleError(error, filename, ActionTypes.DELETE))
}

const generateFilePath = (title, type) => {
    let date = flagsObject.d || new Date().toISOString()
    const [year, month, day] = date.split("T")[0].split("-")
    if (!(year && month && day)) {
        console.log("Invalid date format. Please provide -d yyyy-mm-dd")
        process.exit(1)
    }
    const formattedDate = type === EntityTypes.PROTOTYPE ? year : `${year}-${month}-${day}`
    const filename = `${formattedDate}-${title.replace(/\s+/g, "-").toLowerCase()}.md`.replace(/[<>:"\/\\|?*]+/g, "")
    const filepath = path.join(process.cwd(), `src/articles/${type}`, filename)

    return { filename, filepath }
}

const getDefaultBlogContent = (title, flags = {}) => `---
title: ${title}
description: 
author: 
draft: true
date: ${new Date().toISOString()}
tags:
  - post
${typeof flags.t === "string" ? flags.t.split(",").map(tag => `  - ${tag}`).join("\n") : ""}---

`
const getDefaultProjectContent = (title, flags = {}) => `---
title: ${title}
description:
date:
endDate:
image:
linkDemo:
linkCode:
tags:
  - project
${typeof flags.t === "string" ? flags.t.split(",").map(tag => `  - ${tag}`).join("\n") : ""}---`;
const getDefaultPrototypeContent = (title, flags = {}) => `---
title: ${title}
status: 1
description: 
date:
linkDemo: 
language: 
code: |-
tags:
  - prototype
${typeof flags.t === "string" ? flags.t.split(",").map(tag => `  - ${tag}`).join("\n") : ""}---
`

const handleMake = (type, title) => {
    switch (type) {
        case EntityTypes.BLOG:
            generateBlogFile(title)
            break
        case EntityTypes.PROJECT:
            generateProjectFile(title)
            break
        case EntityTypes.PROTOTYPE:
            generatePrototypeFile(title)
            break
        default:
            console.log(`Invalid Type, Valid Types: ${getAllEntityTypes()}`)
    }
}

const handleDelete = (type, title) => {
    switch (type) {
        case EntityTypes.BLOG:
            removeFile(title, EntityTypes.BLOG)
            break
        case EntityTypes.PROJECT:
            removeFile(title, EntityTypes.PROJECT)
            break
        case EntityTypes.PROTOTYPE:
            removeFile(title, EntityTypes.PROTOTYPE)
            break
        default:
            console.log(`Invalid Type, Valid Types: ${getAllEntityTypes()}`)
    }
}

switch (action) {
    case ActionTypes.MAKE:
        handleMake(type, title)
        break
    case ActionTypes.DELETE:
    case ActionTypes.REMOVE:
        handleDelete(type, title)
        break
    default:
        console.log(`Invalid Action. Valid Actions: ${getAllActionTypes()}`)
}

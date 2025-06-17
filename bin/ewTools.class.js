import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import chalk from "chalk"

class Configuration {
    static load() {
        dotenv.config()
    }

    static get(key) {
        Configuration.load()
        return process.env[key]
    }
}

class Logger {
    static isDevelopment = Configuration.get("TOOLS_ENV") === "development"
    static debugModeSuffix = chalk.gray(`[debug]`)
    static Types = Object.freeze({
        INFO: "Info",
        WARN: "Warning",
        ERROR: "Error",
        EMPTY: ""
    })

    static log(text, type = Logger.Types.EMPTY) {
        const typeFormatted = type ? `${type}:` : ""
        if (this.isDevelopment) console.log(`${Ewtools.programSuffix}${this.debugModeSuffix} ${typeFormatted}`, text)
    }
}

class FlagsProcessor {
    static formatFlagsString(args) {
        if (!Array.isArray(args) || args.length === 0) return ""
        let isPreviousDump = false

        return args.map((token, index) => {
            if (index === 0) return token
            if (token.startsWith("-") || isPreviousDump) {
                if (token.includes("dump")) { isPreviousDump = true } else { isPreviousDump = false }
                return "+" + token
            }

            return ";" + token
        }).join("")
    }

    static parseFlags(flags) {
        const paramWithValue = flags.split("+")
        const flagsObject = {}
        paramWithValue.forEach(token => {
            let [attr, value] = token.split(";")
            if (!value) value = true
            if (attr.startsWith("--")) {
                flagsObject[attr.slice(2)] = value
            } else {
                flagsObject[attr.slice(1)] = value
            }
        })
        return flagsObject
    }
}

class FileHandler {
    static ActionTypes = Object.freeze({ MAKE: "make", DELETE: "delete", REMOVE: "remove" })
    static EntityTypes = Object.freeze({ BLOG: "blog", PROJECT: "project", PROTOTYPE: "prototype" })

    static generateFilePath(title, type, flags) {
        let date = flags.d || new Date().toISOString()
        const [year, month, day] = date.split("T")[0].split("-")

        if (!(year && month && day)) {
            console.log("Invalid date format. Please provide -d yyyy-mm-dd")
            process.exit(1)
        }

        const formattedDate = type === this.EntityTypes.PROTOTYPE ? year : `${year}-${month}-${day}`
        const filename = `${formattedDate}-${title.replace(/\s+/g, "-").toLowerCase()}.md`.replace(/[<>:"\/\\|?*]+/g, "")
        const filepath = path.join(process.cwd(), `src/articles/${type}`, filename)

        return { filename, filepath }
    }

    static handleError(error, filename, { type, action = this.ActionTypes.MAKE }) {
        if (error) return console.error(`${Ewtools.programSuffix} Error creating file: ${error.message}`)
        console.log(`${Ewtools.programSuffix} File "${type}/${filename}" ${action === this.ActionTypes.MAKE ? "created" : "removed"} successfully.`)
    }

    static generateFile(title, entityType, flags, getContentFunction) {
        const { filename, filepath } = this.generateFilePath(title, entityType, flags)
        const content = getContentFunction(title, flags)
        fs.writeFile(filepath, content, (error) => this.handleError(error, filename, { type: entityType }))
    }

    static removeFile(title, entityType, flags) {
        const { filename, filepath } = this.generateFilePath(title, entityType, flags)
        fs.rm(filepath, (error) => this.handleError(error, filename, { type: entityType, action: this.ActionTypes.DELETE }))
    }

    static getAllActionTypes() {
        return Object.values(this.ActionTypes).map((action, index, arr) => (index === arr.length - 1 ? ` and \`${action}\`` : ` \`${action}\`,`)).join("")
    }

    static getAllEntityTypes() {
        return Object.values(this.EntityTypes).map((entity, index, arr) => (index === arr.length - 1 ? ` and \`${entity}\`` : ` \`${entity}\`,`)).join("")
    }
}

class ContentGenerator {
    static tagsHandler(tags) {
        return typeof tags === "string" ? tags.split(",").map(tag => `\n  - ${tag}`).join("") : ""
    }

    static getDefaultBlogContent(title, flags = {}) {
        return `---
title: ${title}
description: 
author: 
draft: true
date: ${new Date().toISOString()}
tags:
  - post${ContentGenerator.tagsHandler(flags.t)}
---\n`
    }

    static getDefaultProjectContent(title, flags = {}) {
        return `---
title: ${title}
description:
date:
endDate:
image:
linkDemo:
linkCode:
tags:
  - project${ContentGenerator.tagsHandler(flags.t)}
---\n`
    }

    static getDefaultPrototypeContent(title, flags = {}) {
        return `---
title: ${title}
status: 1
description: 
date:
linkDemo: 
language: 
code: |-
tags:
  - prototype${ContentGenerator.tagsHandler(flags.t)}
---\n`
    }
}

class Ewtools {
    static programSuffix = `${chalk.gray(`[`)}${chalk.green(`EwT`)}${chalk.gray(`/bin]`)}`

    constructor(args) {
        this.args = args
        this.command = args[0]
        this.title = args[1]
        this.restArgs = args.slice(2)
        this.flags = FlagsProcessor.parseFlags(FlagsProcessor.formatFlagsString(this.restArgs))
        this.action = this.command.split(":")[0]
        this.type = this.command.split(":")[1]
    }

    validateArgs() {
        if (this.args.length < 2) {
            console.log(`${Ewtools.programSuffix} Usage: ${chalk.green(`./ewtools.bat make:blog "title"`)}`)
            process.exit(1)
        }
    }

    execute() {
        this.validateArgs()
        Logger.log(this.args, Logger.Types.INFO)
        Logger.log(this.flags, Logger.Types.INFO)
        Logger.log(FlagsProcessor.formatFlagsString(this.restArgs), Logger.Types.INFO)

        if (!this.flags.dump && !this.flags.dp) switch (this.action) {
            case FileHandler.ActionTypes.MAKE:
                this.handleMake()
                break

            case FileHandler.ActionTypes.REMOVE:
            case FileHandler.ActionTypes.DELETE:
                this.handleDelete()
                break

            default:
                console.log(`${Ewtools.programSuffix} Invalid Action. Valid Actions: ${chalk.green(FileHandler.getAllActionTypes())}`)
        }
    }

    handleMake() {
        switch (this.type) {
            case FileHandler.EntityTypes.BLOG:
                FileHandler.generateFile(this.title, this.type, this.flags, ContentGenerator.getDefaultBlogContent)
                break

            case FileHandler.EntityTypes.PROJECT:
                FileHandler.generateFile(this.title, this.type, this.flags, ContentGenerator.getDefaultProjectContent)
                break

            case FileHandler.EntityTypes.PROTOTYPE:
                FileHandler.generateFile(this.title, this.type, this.flags, ContentGenerator.getDefaultPrototypeContent)
                break

            default:
                console.log(`${Ewtools.programSuffix} Invalid Type, Valid Types: ${chalk.green(FileHandler.getAllEntityTypes())}`)
        }
    }

    handleDelete() {
        if (this.type === "" || this.type === undefined) return console.log(`${Ewtools.programSuffix} Invalid Type, Valid Types: ${chalk.green(FileHandler.getAllEntityTypes())}`)
        FileHandler.removeFile(this.title, this.type, this.flags)
    }
}

const args = process.argv.slice(2)

if (args.length <= 0) {
    console.log(`${Ewtools.programSuffix} Usage: ${chalk.green(`./ewtools.bat make:blog "title"`)}`)
} else {
    new Ewtools(args).execute()
}
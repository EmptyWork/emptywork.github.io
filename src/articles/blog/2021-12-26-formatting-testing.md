---
title: Formatting test for Markdown
description: The purpose of this file is to test all the markdown support and syntaxs
author: EmptyWork
draft: false
date: 2021-12-26T09:30:51.516Z
tags:
  - post
  - html
  - javascript
  - markdown
---

[[toc]]

# Main header

> Another example of the formatting, this is what supposed to be a blockqoute ==This is an example of the highlight=={.highlight}

## Code snippet

> You can only do this if you have certain understanding regarding how to do the thing that are meant to be that thing.
>
> > `this is an inline-quote` does it works? click here to [jump to code-snippet-2](#code-snippet-2), or you can just scroll down, also you can hover on the code blocks.
> >
> > ```bash
> > npm run install && npm run update
> > ```
> >
> > > This a blockqoute inside a blockqoute inside a blockquote, it is a `block-ception`
> > >
> > > ```js
> > > const isDarkThemePreferred =
> > >   !localStorage.theme &&
> > >   window.matchMedia('(prefers-color-scheme: dark)').matches
> > > const dataset = document.documentElement.dataset // Getting all dataset
> > > ```

### Secondary header

The markdown is being handle by the markdown-it and eleventy, while some extra works is being done by vanila javascript.

```sql
SELECT * FROM `ikan`;
```

```sql
DROP table `ikan`;
```

#### Code snippet

```python
def greet(name):
  print(f"Hello, {name}! Welcome to the Markdown formatting test.")

greet("Visitor")
```

Here is a simple JavaScript function that adds two numbers and logs the result.

### Code snippet 2

```javascript
function add(a, b) {
  return a + b
}

console.log(add(2, 3)) // Output: 5
```

Here is a simple JavaScript function that adds two numbers and logs the result.

```js
const schedulerLoader = (schedules = {}) => {
  let time = new Date()
  let currentTime = time.getUTCHours() + 9
  if (currentTime > 23) currentTime -= 23

  if (replaceStatus) replaceStatus.textContent = 'Idle'

  setTimeout(() => {
    for (let i = 0; i < schedules.length; i++) {
      let { day, endHour, startHour } = schedules[i]
      if (!replaceStatus) return

      if (days[currentDay] === toCapitalizeWord(day)) {
        if (currentTime > startHour && currentTime < endHour) {
          replaceStatus.textContent = 'Studying'
        }
        break
      }
      replaceStatus.textContent = 'Idle'
    }
  }, 0)
}
```

```diff:js
const schedulerLoader = (schedules = {}) => {
  let time = new Date()
  let currentTime = time.getUTCHours() + 9
  if (currentTime > 23) currentTime -= 23

  if (replaceStatus) replaceStatus.textContent = 'Idle'
-  setTimeout(() => throw new Error(),0)
+  setTimeout(() => {
+    for (let i = 0; i < schedules.length; i++) {
+      let { day, endHour, startHour } = schedules[i]
+      if (!replaceStatus) return
+
+      if (days[currentDay] === toCapitalizeWord(day)) {
+        if (currentTime > startHour && currentTime < endHour) {
+          replaceStatus.textContent = 'Studying'
+        }
+        break
+      }
+      replaceStatus.textContent = 'Idle'
+    }
+  }, 0)
```

```md
├─ docs
│  ├─ .vuepress
│  │  └─ config.js
│  └─ README.md
└─ package.json
```
And this is an example of markdown list:

```md
- line
- line
- line
  1. stop it
  2. what
  3. don't worry
```

- line
- line
  - another list
  - what is this?
- line
  1. stop it
  2. what
  3. don't worry

#### Code snippet 3

```js
const Logger = (text, type = LoggerType.EMPTY) => {
  const typeFormatted = type === LoggerType.EMPTY ? `${type}` : `${type}:`
  if (isDevelopment) console.log(`${typeFormatted}`, text)
}
```

##### Last line header

```css
#body {
  color: red;
}
```

Another test with json <kbd>c + d</kbd> <kbd>control + d</kbd> or <kbd>meta + d</kbd>.

```json
{
  "id": "s9RT21XS8399#!821838"
}
```

What about error? you can do a combo of <kbd>Shift + A</kbd>, with this as the sole purpose of testing any random stuff.

### Secondary header

[#code-snippet](#code-snippet-1) is type of reference that we needs<sup>[[1]](#code-snippet-5)</sup>.

## Table?

| Side            | Face                                           | Timeline              |
| --------------- | ---------------------------------------------- | --------------------- |
| Side            | Another one bites the dust                     | <sup>2025-02-01</sup> |
| For The Emperor | Light up the sky with the flame of the emperor |                       |

---
title: CosmosMC Custom Item Encyclopedia (CEI) - Website
status: 1
description: An encyclopedia of custom items on CosmosMC. The website's data is incomplete due to the sheer number of items currently available on the server.
date: 2025-02-13
language: en
tags:
  - prototype
  - html5
  - css3
  - javascript
  - es2015
linkDemo: https://cosmos.emptywork.my.id/
code: |-
  const getAllNestedChildren = (element) => {
      let allChildren = []
      const children = Array.from(element.children)
      children.forEach(child => {
          allChildren.push(child)
          allChildren.concat(getAllNestedChildren(child))
      })
      return allChildren;
  }
---

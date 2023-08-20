---
title: Ew-Javascript
status: 2
description: Collection of JavaScript native based application, way to approach the problem with ES6 and It's Implementation.
date: 2021-01-26
language: en
tags:
  - prototype
  - html5
  - css3
  - javascript
  - A11y
  - Accesibillity
  - Framework
linkDemo: https://emptywork.github.io/ew-javascript
code: |-
  const preLoad = () => {
    let preload = document.querySelector('.preload');
    let content = document.querySelector('.inside');
    setTimeout(() => {
      preload.style.marginTop =
      'calc(-100vh + -300px)';
    }, 2000)
    setTimeout(() => {
      content.style.display = 'grid'; 
    }, 2100); 
  }
---

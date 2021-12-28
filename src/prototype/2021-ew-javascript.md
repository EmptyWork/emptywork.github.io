---
title: Ew-Javascript
status: 2
description: Kumpulan proyek Javascript (native), kode-kode ini akan
  dikembangkan lagi untuk di gunakan sebagai front-end development.
date: 2021-01-26
tags:
  - prototype
  - html5
  - css3
  - javascript
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

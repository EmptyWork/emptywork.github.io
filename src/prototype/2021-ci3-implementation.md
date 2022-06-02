---
title: CI3 - Implementation
status: 1
description: Contoh implementasi dari CodeIgniter, adapun prototype ini
  merupakan latihan yang dilakukan pada saat mengikuti kelas PBP.
date: 2021-12-26T11:30:51.516Z
tags:
  - prototype
  - php
  - codeigniter3
linkDemo: http://pbp2stevarth.rf.gd/
language: id
code: |-
  <?php
      include_once "./earth/human.php";
      $human = new Person("EmptyWork");
      $happy = $human->getCurrentMood();
      if(!$happy) echo "-.-";
---

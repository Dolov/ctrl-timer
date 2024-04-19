 
# Enhanced and controllable setInterval、setTimeout in nodejs and browser
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/dolov/ctrl-timer)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/ctrl-timer)
![NPM Version](https://img.shields.io/npm/v/ctrl-timer)
![NPM Type Definitions](https://img.shields.io/npm/types/ctrl-timer)
![NPM Downloads](https://img.shields.io/npm/d18m/ctrl-timer)
[![Coverage Status](https://coveralls.io/repos/github/Dolov/ctrl-timer/badge.svg?branch=main)](https://coveralls.io/github/Dolov/ctrl-timer?branch=main)



## Features
- Supporting pause and restart.
- The design of API is close to native API.
- Lightweight and does not rely on any third-party dependencies.
- Can clear or pause all instances simultaneously.

## Installation

```bash
npm i ctrl-timer
```

## Usage

### Interval

#### basic

```js

import { Interval } from 'ctrl-timer'

const timer = new Interval()

timer.setInterval(() => {
    console.log('hello-world!')
}, 1000)

```

#### options
```js

import { Interval } from 'ctrl-timer'

const timer = new Interval({
    // Max number of exec, default infinity
    maxCount: 5,
    // After max, clear or pause, default clear
    maxClear: false,
})

timer.setInterval(() => {
    console.log('hello-world!')
}, 1000)

```

#### pause restart
```js
import { Interval } from 'ctrl-timer'

const timer = new Interval()

timer.setInterval(() => {
    console.log('hello-world!')
}, 1000)

timer.pause()
timer.restart()
```

#### update
```js

import { Interval } from 'ctrl-timer'

const timer = new Interval()

timer.setInterval(() => {
    console.log('hello-world!')
}, 1000)

timer.update({
    handler() {
        console.log('new handler!')
    },
    timeout: 3000
})

```

#### clearInterval
```js

import { Interval } from 'ctrl-timer'

const timer = new Interval()

timer.setInterval(() => {
    console.log('hello-world!')
}, 1000)

timer.clearInterval()
// not work
timer.pause()
// not work
timer.restart()
```

### Timeout
```js

import { Timeout } from 'ctrl-timer'

const timer = new Timeout()

timer.setTimeout(() => {
    console.log('hello-world!')
}, 1000)

```

### Interval / Timeout static methods
```js

import { Interval } from 'ctrl-timer'

const timer = new Timeout()

timer.setTimeout(() => {
    console.log('hello-world!')
}, 1000)

Interval.pause()
Interval.restart()
Interval.clearInterval()

```

## Interval Instance API
| methods       | Description               | Type                         | Default |
| ------------- | ------------------------- | ---------------------------- | ------- |
| setInterval   |                           |                              |         |
| pause         |                           |                              |         |
| restart       |                           |                              |         |
| update        | update handler or timeout | ({handler, timeout}) => void |         |
| clearInterval | clear                     | () => void                   |         |

## Timeout Instance API
| methods       | Description               | Type                         | Default |
| ------------- | ------------------------- | ---------------------------- | ------- |
| setTimeout    |                           |                              |         |
| pause         |                           |                              |         |
| restart       |                           |                              |         |
| update        | update handler or timeout | ({handler, timeout}) => void |         |
| clearInterval | clear                     | () => void                   |         |

## Class static methods
| methods                  | Description | Type       | Default |
| ------------------------ | ----------- | ---------- | ------- |
| pause                    | pause all   | () => void |         |
| restart                  | restart all | () => void |         |
| clearTimeout (Timeout)   | clear all   | () => void |         |
| clearInterval (Interval) | clear all   | () => void |         |
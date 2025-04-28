<img src="docs/public/tempo.png" alt="TEMPO" width="500" height="195">

[![Vitest](https://github.com/formkit/tempo/actions/workflows/tests.yml/badge.svg)](https://github.com/formkit/tempo/actions/workflows/tests.yml)
![GitHub Sponsors](https://img.shields.io/github/sponsors/formkit)
![NPM Version](https://img.shields.io/npm/v/%40formkit%2Ftempo)

# Tempo — The easiest way to work with dates in JavaScript (and TypeScript)

Tempo is a new library in a proud tradition of JavaScript date and time libraries. Inspired by the likes of moment.js, day.js, and date-fns Tempo is built from the ground up to be as small and easy to use as possible.

Tempo is best thought of as a collection of utilities for working with `Date` objects — an important distinction from other libraries that provide custom date primitives. Under the hood, Tempo mines JavaScript's `Intl.DateTimeFormat` to extract complex data like timezones offsets and locale aware date formats giving you a simple API to format, parse, and manipulates dates.

Tempo is tiny tree-shakable framework, you can only take what you need. All functionality is available in **5.2 kB for esm** and **5.5 kB for cjs** modules (minified and brotlied). [Size Limit](https://github.com/ai/size-limit) controls the size.

<a href="https://tempo.formkit.com">
<img src="docs/public/read-the-docs.png" alt="Read the docs" width="200" height="43">
</a>

---

Created by the <a href="https://formkit.com">FormKit team</a>.


## Fork Differences

This fork enhances the original Tempo library by adding the `compile` function 

```ts
const formatter = compile("HH:mm")
const dataStr = formatter(dataObject);
```

Using compile result in much faster formatting functionality when used against a large number of dates

```text
Format mask: YYYY-MM-DD ( 1000 dates )
[  ] time: 28.57ms, Avg: 0.2857ms
[wx] time: 0.27ms, Avg: 0.0027ms
```
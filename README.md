# Treadwheel

[![NPM Version](https://img.shields.io/npm/v/treadwheel)](https://www.npmjs.com/package/treadwheel)
[![CI](https://github.com/jo-phil/treadwheel/actions/workflows/ci.yml/badge.svg)](https://github.com/jo-phil/treadwheel/actions/workflows/ci.yml)
[![Docs](https://github.com/jo-phil/treadwheel/actions/workflows/docs.yml/badge.svg)](https://jo-phil.github.io/treadwheel)

Treadwheel uses time-lock puzzles based on
[Rivest, Shamir, and Wagner (1996)](https://people.csail.mit.edu/rivest/pubs/RSW96.pdf)
to protect information from bots while keeping access simple for humans.

Solving a time-lock puzzle requires inherently sequential computation, raising
the cost of accessing protected information. While this cost is negligible for
legitimate users looking up a single piece of information, such as an email
address or phone number, it accumulates across large-scale scraping operations,
making mass collection more expensive and potentially less attractive.

## Prerequisites

**Node.js**

- Node.js 22 or later.

**Browser**

- A secure context (HTTPS or localhost) for the Web Crypto API.
- ES2020 support, including BigInt.

## Installation

```bash
npm i treadwheel
```

## Usage

This section explains how to seal plaintext using the CLI and integrate a widget
to unseal it in a web application. For advanced configuration and full API
details, see the [Documentation](https://jo-phil.github.io/treadwheel).

### 1. Sealing plaintext

Use the `treadwheel seal` command to seal plaintext:

```bash
npx treadwheel seal "Hello, World!"
```

This outputs a Base64URL-encoded envelope containing the time-lock puzzle and
encrypted payload, which can be used for the `envelope` attribute of the widget.

> [!TIP]
> The puzzle's difficulty can be adjusted with the `--time` option. See the
> [CLI Reference](https://jo-phil.github.io/treadwheel/cli) for details.

### 2. Importing the widget

To allow visitors to unseal the envelope on your website, register the
`<treadwheel-widget>` element by importing the `treadwheel/widget` module:

```javascript
import 'treadwheel/widget';
```

Alternatively, use a script tag to load it from a CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/treadwheel@latest/dist/treadwheel-widget.min.js"></script>
```

### 3. Using the widget

Add a `<treadwheel-widget>` element with the envelope to your HTML document:

```html
<treadwheel-widget envelope="tw__..."></treadwheel-widget>
```

## License

This project is licensed under the [Apache License 2.0](LICENSE).

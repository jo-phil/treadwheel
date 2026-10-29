# Treadwheel

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

### 1. Sealing plaintext

Use the `treadwheel seal` command to seal plaintext:

```bash
npx treadwheel seal "Hello, World!"
```

This outputs a Base64URL-encoded envelope containing the time-lock puzzle and
encrypted payload.

The puzzle's difficulty can be adjusted using the `--time` and
`--modulus-length` options. The `--time` option specifies the number of
sequential squarings required to solve the puzzle, while `--modulus-length`
specifies the desired bit length of its modulus.

### 2. Importing the widget

To use the widget in a client-side application, import the `treadwheel/widget`
module:

```javascript
import 'treadwheel/widget';
```

Alternatively, load it from a CDN with a script tag:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/treadwheel@latest/dist/treadwheel-widget.min.js"></script>
```

### 3. Using the widget

Add a `<treadwheel-widget>` element with the envelope to your HTML document:

```html
<treadwheel-widget envelope="tw__..."></treadwheel-widget>
```

If the plaintext contains HTML, set `output="html"` (only for envelopes from a
trusted source):

```html
<treadwheel-widget output="html" envelope="tw__..."></treadwheel-widget>
```

To display the widget in a floating layout, include a button inside the element:

```html
<treadwheel-widget envelope="tw__...">
  <button type="button">Click to reveal</button>
</treadwheel-widget>
```

## License

This project is licensed under the [Apache License 2.0](LICENSE).

<script setup>
import pkg from '../package.json';
</script>

# Quickstart

This guide explains how to seal plaintext using the CLI and integrate a widget
to unseal it in a web application. For advanced usage, see the more in-depth
pages on [CLI](/cli), [Widget](/widget), and [JavaScript API](/api).

## Installation

::: code-group

```bash [npm]
npm i treadwheel
```

```bash [pnpm]
pnpm add treadwheel
```

```bash [yarn]
yarn add treadwheel
```

```bash [bun]
bun add treadwheel
```

:::

::: tip
You may skip the installation if you use the CLI without permanent installation
(e.g., via `npx` or `bunx`) and load the widget module from a CDN.
:::

## Sealing plaintext

Use the `treadwheel seal` command to seal plaintext:

::: code-group

```bash [npm]
npx treadwheel seal "Hello, World!"
```

```bash [pnpm]
pnpm treadwheel seal "Hello, World!"
```

```bash [yarn]
yarn treadwheel seal "Hello, World!"
```

```bash [bun]
bunx treadwheel seal "Hello, World!"
```

:::

This outputs a Base64URL-encoded envelope containing the time-lock puzzle and
encrypted payload, which can be used for the `envelope` attribute of the widget.

::: tip
The puzzle's difficulty can be adjusted with the `--time` option. See the
[CLI Reference](/cli) for details.
:::

## Widget integration

### Importing the widget

To allow visitors to unseal the envelope on your website, register the
`<treadwheel-widget>` element by importing the `treadwheel/widget` module:

```javascript
import 'treadwheel/widget';
```

Alternatively, use a script tag to load it from a CDN:

```html-vue
<script type="module" src="https://cdn.jsdelivr.net/npm/treadwheel@{{pkg.version}}/dist/treadwheel-widget.min.js"></script>
```

### Using the widget

Add a `<treadwheel-widget>` element with the envelope to your HTML document:

```html
<treadwheel-widget 
  envelope="tw__AQEAAAAAHQAAAAAAA9CQq2oHsMByzNHBqhqfHw2pvIPD5Fit_XOJhIR77SZz27bNEhcj_zdiGRm0OPalvGjLUKxdEzBNHzc9GfhiAf8A4pBkk4SaNIEYWcM2ILObtw4csB06C_lgfeOdZ-jto-pAEU4X2l-b2hPYaHxmr0cJUrvGTogLFWwpxG-xrxeXMvy24HNUXvblfAgigmZ8MfIWLwt7bOZuDcY4MmslPr7xKQ0N2qyK9UgqCg8O5e7_trpJlrLccyK9hlNoDYW6Vn0POG5CUWk6wG7OBa6vzKb-UJTLH9LlNFkLUEarcmi0b2wilfL2NNrAxunKOnxb3sh8vYK-Gl0GT2mTaRrp-Z0y0ZA1USCOpC70XKjSzKdUcY9Qg4i2OFvHLYVoigSzyKQ2gabkwihWLcxHOpMTIyzWnCBDHQv8YWK9FPS1YRWPG5XfOsb7WvC0tdxAXKPVuMehJkKx-I8UUyQarf2fx4hnTV1HQ-GkdKlsp66mNYNwNfGDY9QnD_SUfSR7n8m8WkRigk6npk84aUT_h_kaRWLahmbH7YbsoRhLOLalKh4JyVvJwq2Gm76Nt-9TxS781rroBkWwRd8LTaO_4eXiiVPdrCUlYt2u-KnfqTUCswCCIMZPnet41mvqWfASydNRJEf8WxbdlQxukhmZsasYagIEp22wF6Dpx3JToKwhV34pc0kAApH_yuCpdXehWEQmznsJKzNHJG2kDM5ImVjdV3h6_LZ2OIDEqAdem7KlmD0yUlhGRITiVqtplgNtVSi5JLag_5vOcSTJ7qvS"
></treadwheel-widget>
```

***

<treadwheel-widget envelope="tw__AQEAAAAAHQAAAAAAA9CQq2oHsMByzNHBqhqfHw2pvIPD5Fit_XOJhIR77SZz27bNEhcj_zdiGRm0OPalvGjLUKxdEzBNHzc9GfhiAf8A4pBkk4SaNIEYWcM2ILObtw4csB06C_lgfeOdZ-jto-pAEU4X2l-b2hPYaHxmr0cJUrvGTogLFWwpxG-xrxeXMvy24HNUXvblfAgigmZ8MfIWLwt7bOZuDcY4MmslPr7xKQ0N2qyK9UgqCg8O5e7_trpJlrLccyK9hlNoDYW6Vn0POG5CUWk6wG7OBa6vzKb-UJTLH9LlNFkLUEarcmi0b2wilfL2NNrAxunKOnxb3sh8vYK-Gl0GT2mTaRrp-Z0y0ZA1USCOpC70XKjSzKdUcY9Qg4i2OFvHLYVoigSzyKQ2gabkwihWLcxHOpMTIyzWnCBDHQv8YWK9FPS1YRWPG5XfOsb7WvC0tdxAXKPVuMehJkKx-I8UUyQarf2fx4hnTV1HQ-GkdKlsp66mNYNwNfGDY9QnD_SUfSR7n8m8WkRigk6npk84aUT_h_kaRWLahmbH7YbsoRhLOLalKh4JyVvJwq2Gm76Nt-9TxS781rroBkWwRd8LTaO_4eXiiVPdrCUlYt2u-KnfqTUCswCCIMZPnet41mvqWfASydNRJEf8WxbdlQxukhmZsasYagIEp22wF6Dpx3JToKwhV34pc0kAApH_yuCpdXehWEQmznsJKzNHJG2kDM5ImVjdV3h6_LZ2OIDEqAdem7KlmD0yUlhGRITiVqtplgNtVSi5JLag_5vOcSTJ7qvS">
</treadwheel-widget>

# API Reference

## SealOptions

Optional configuration options for [seal](#seal).

### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-moduluslength"></a> `modulusLength?` | `number` | The desired bit-length of the puzzle's modulus. **Default** `2048` |
| <a id="property-time"></a> `time?` | `number` | The number of sequential squarings required to solve the time-lock puzzle. **Default** `250_000` |

***

## UnsealInWorkerOptions

Optional configuration options for [unsealInWorker](#unsealinworker).

### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="property-signal"></a> `signal?` | `AbortSignal` | Signal to abort the operation. |

***

## seal()

> **seal**(`plaintext`, `options?`): `Promise`\<`string`\>

Seal plaintext using a time-lock puzzle.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `plaintext` | `string` | The plaintext to seal. |
| `options?` | [`SealOptions`](#sealoptions) | Optional configuration options. |

### Returns

`Promise`\<`string`\>

A Base64URL-encoded envelope.

***

## unseal()

> **unseal**(`envelope`): `Promise`\<`string`\>

Unseal an envelope by solving its time-lock puzzle.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `envelope` | `string` | A Base64URL-encoded envelope. |

### Returns

`Promise`\<`string`\>

The decrypted plaintext.

***

## unsealInWorker()

> **unsealInWorker**(`envelope`, `options?`): `Promise`\<`string`\>

Unseal an envelope in a web worker.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `envelope` | `string` | A Base64URL-encoded envelope. |
| `options?` | [`UnsealInWorkerOptions`](#unsealinworkeroptions) | Optional configuration options. |

### Returns

`Promise`\<`string`\>

The decrypted plaintext.

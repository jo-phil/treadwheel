# Command Line Interface

The Treadwheel CLI provides a simple way to create envelopes for the client-side
[widget](/widget).

## `treadwheel seal`

Seal plaintext using a time-lock puzzle.

### Usage

```bash
treadwheel seal <plaintext>
```

### Options

| Option                    | Description                                                                                 |
|---------------------------|---------------------------------------------------------------------------------------------|
| `--time <squarings>`      | The number of sequential squarings required to solve the time-lock puzzle (default: 250000) |
| `--modulus-length <bits>` | The desired bit-length of the puzzle's modulus (default: 2048)                              |

## `treadwheel unseal`

Unseal an envelope by solving its time-lock puzzle.

### Usage

```bash
treadwheel unseal <envelope>
```

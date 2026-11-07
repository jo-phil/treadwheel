# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Abrupt disappearance of floating widgets triggered by output transitions.

## [1.0.4] - 2026-11-06

### Security

- Patched time-lock puzzle construction to match the original RSW formulation by
  eliminating the possibility of creating trivial puzzles with a base of 0 or 1
  (though this was highly unlikely for any secure modulus length).

## [1.0.3] - 2026-11-04

### Fixed

- Unwanted layout shifts affecting floating widgets and their outputs.
- Unintuitive focus order and focus loss during the fadeout of floating widgets.
- Potential screen reader mispronunciations due to missing `lang` attribute.

## [1.0.2] - 2026-11-02

### Fixed

- Sourcemaps pointing to missing source files in the npm release. To avoid
  downstream warnings while keeping the installation size small, sourcemaps are
  now omitted from the unbundled build.

## [1.0.1] - 2026-10-31

### Fixed

- Unnecessary computation in insecure browser contexts. The `unseal` function
  (and consequently `unsealInWorker`) now fails fast when the Web Crypto API is
  not available to avoid solving time-lock puzzles for payloads that cannot be
  decrypted.

## [1.0.0] - 2026-10-29

*Initial release.*

[Unreleased]: https://github.com/jo-phil/treadwheel/compare/1.0.4...HEAD
[1.0.4]: https://github.com/jo-phil/treadwheel/releases/tag/1.0.4
[1.0.3]: https://github.com/jo-phil/treadwheel/releases/tag/1.0.3
[1.0.2]: https://github.com/jo-phil/treadwheel/releases/tag/1.0.2
[1.0.1]: https://github.com/jo-phil/treadwheel/releases/tag/1.0.1
[1.0.0]: https://github.com/jo-phil/treadwheel/releases/tag/1.0.0

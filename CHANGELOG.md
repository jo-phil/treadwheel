# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Unnecessary computation in insecure browser contexts. The `unseal` function
  (and consequently `unsealInWorker`) now fails fast when the Web Crypto API is
  not available to avoid solving time-lock puzzles for payloads that cannot be
  decrypted.

## [1.0.0] - 2026-10-29

*Initial release.*

[Unreleased]: https://github.com/jo-phil/treadwheel/compare/1.0.0...HEAD
[1.0.0]: https://github.com/jo-phil/treadwheel/releases/tag/1.0.0

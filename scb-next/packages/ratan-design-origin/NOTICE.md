# Token and font provenance

The scoped WebKit stylesheet is generated from the canonical SC WebKit 2.0.5
build in this repository. `dist/webkit-sources.json` records source SHA-256
hashes and packaged WOFF2 font names. Regenerate with `npm run tokens:generate`
after building the canonical WebKit source. Ordinary builds use committed
assets and do not require that source checkout.

SC WebKit and its font assets retain their original ownership and distribution
restrictions. This package is a local/internal extraction candidate, not an
authorization to redistribute corporate assets publicly. Confirm registry,
asset licensing, and release ownership before publishing.

// A deterministic React 18 remote fixture, independent of business apps and APIs.
const element = (type, props, key = null) => ({
  $$typeof: Symbol.for('react.element'), type, props, key, ref: null, _owner: null,
});

function CachedTile() {
  return element('section', { children: [
    element('h2', { children: 'Cached remote fixture' }, 'heading'),
    element('input', { 'aria-label': 'Remote draft', defaultValue: 'Initial draft' }, 'draft'),
  ] });
}

export async function init() {}
export async function get() {
  return () => ({ default: CachedTile });
}

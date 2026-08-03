import { getGlobalMediaQuery, mediaQueryKey } from '../../src/shared/mediaQuery.js';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
const listeners: Record<string, Array<(
              this: MediaQueryList,
              ev: MediaQueryListEventMap[keyof MediaQueryListEventMap]
            ) => any>> = {};
// const queries = <Record<string, Writeable<MediaQueryList> & {mocked: true}>>{};
const queries: Record<string, MockMediaQueryList> = {};
const results: Record<string, boolean> = {};


class MockMediaQueryList extends EventTarget {
  media = '';
  onchange: MediaQueryList['onchange'];

  constructor(private query: string) {
    super();
    this.media = query;
  }

  private _match = false;
  get matches(): boolean {
    return this._match;
  }
  set matches(val: boolean) {
    if (val !== this._match) {
      this._match = val;

      const ev = new MockMediaQueryListEvent('change', {
        media: this.media,
        matches: this._match,
      });
      this.onchange?.call(this as unknown as MediaQueryList, ev);
      this.dispatchEvent(ev);
    }
  }
}
class MockMediaQueryListEvent extends Event {
  media = '';
  matches = false;

  constructor(type: string, init: { media?: string; matches?: boolean }) {
    super(type);
    if (init.media) this.media = init.media;
    if (init.matches) this.matches = init.matches;
  }
}


export function mockMatchMedia() {
  Object.defineProperty(window || global, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(
      query =>  queries[query] = new MockMediaQueryList(query)
    ),
  });
  cleanGlobalMediaQuery();
  getGlobalMediaQuery();

  return queries;
}

function cleanGlobalMediaQuery() {
  if (document?.body && mediaQueryKey in document.body)
    document.body[mediaQueryKey] = undefined;
}


const ogMatchMedia = window.matchMedia;
mockMatchMedia.stopMocking = () => {
  window.matchMedia = ogMatchMedia;
  cleanGlobalMediaQuery();
};
mockMatchMedia.queries = queries;
mockMatchMedia.results = results;
mockMatchMedia.toggle = (query: any) => {
  if (query in queries) 
    queries[query].matches = !queries[query].matches;
};

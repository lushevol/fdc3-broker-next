import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

const profileImage =
  '<svg xmlns="http://www.w3.org/2000/svg" width="151" height="151" viewBox="0 0 151 151"><rect width="151" height="151" fill="#b7c9d3"/><circle cx="75.5" cy="56" r="25" fill="#fff"/><path d="M27 146c0-33 21-53 48.5-53S124 113 124 146" fill="#fff"/></svg>';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('https://axess.sc.net/**/photo', (route) =>
      route.fulfill({ contentType: 'image/svg+xml', body: profileImage }),
    );
    await page.route('https://leap.standardchartered.com/**/photo_lg.jpg', (route) =>
      route.fulfill({ contentType: 'image/svg+xml', body: profileImage }),
    );
    await use(page);
  },
});

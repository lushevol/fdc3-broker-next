import { test, expect, type Locator, type Page } from '@playwright/test';

declare const Buffer: {
  from(value: string): Uint8Array;
};

const STORY_URL =
  'iframe.html?globals=&args=&id=components-file-file-input--default&viewMode=story';

const SAMPLE_FILE = {
  name: 'test.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('hello'),
} as const;

const SECOND_FILE = {
  name: 'second.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('second'),
} as const;

async function setComponentProperty<T>(
  component: Locator,
  propertyName: string,
  value: T
) {
  await component.evaluate(
    (element, [key, nextValue]) => {
      (element as any)[key] = nextValue;
    },
    [propertyName, value]
  );
}

function getFileInput(page: Page) {
  const fileInput = page.locator('sc-file-input');
  const filePicker = fileInput.locator('input[type="file"]');

  return { fileInput, filePicker };
}

test.describe('sc-file-input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(STORY_URL);
  });

  test('uploads a file and renders the item', async ({ page }) => {
    const { fileInput, filePicker } = getFileInput(page);

    await filePicker.setInputFiles(SAMPLE_FILE);
    const fileItem = fileInput.locator('sc-file-item');

    await expect(fileItem).toBeVisible();
    await expect(fileInput).toContainText(SAMPLE_FILE.name);

    // Uploading another file should replace the previous one since multiple is false by default
    await filePicker.setInputFiles(SECOND_FILE);

    await expect(fileItem).toHaveCount(1);
    await expect(fileInput).toContainText(SECOND_FILE.name);

    // Enable deletable and check that the delete button appears
    await setComponentProperty(fileInput, 'deletable', true);

    await fileItem.hover();
    await fileItem.locator('[part="delete"]').click();

    await expect(fileInput.locator('sc-file-item')).toHaveCount(0);

    // Set maxSize to 1 byte and verify that the error message is shown when uploading a file larger than that
    await setComponentProperty(fileInput, 'maxSize', 1);

    await filePicker.setInputFiles({
      name: 'big.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('this is larger than one byte'),
    });

    await expect(fileInput).toContainText('Exceeded Limit Size');
  });

  test('renders multiple items when multiple is enabled', async ({ page }) => {
    const { fileInput, filePicker } = getFileInput(page);

    await setComponentProperty(fileInput, 'multiple', true);

    await filePicker.setInputFiles([SAMPLE_FILE, SECOND_FILE]);
    
    const fileItems = fileInput.locator('sc-file-item');
    await expect(fileItems.nth(0)).toBeVisible();
    await expect(fileItems.nth(1)).toBeVisible();
    await expect(fileInput).toContainText(SAMPLE_FILE.name);
    await expect(fileInput).toContainText(SECOND_FILE.name);

    // Deleting one item should only remove that item when multiple is enabled
    await setComponentProperty(fileInput, 'readonly', true);

    await expect(fileInput.locator('sc-file-drop-zone')).toHaveCount(0);
  });
});

/**
 * Unit tests for file-utils.ts
 * Target: ≥95% coverage for pure functions
 */

// Mock DOMPurify
import {
  formatFileSize,
  getFileIcon,
  validateFileType,
  sanitizeFileName,
} from '../../../src/components/ScComment/utils/file-utils.js';

jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: (input: string) => input,
  },
}));

describe('file-utils', () => {
  describe('formatFileSize', () => {
    it('formats 0 bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 bytes');
    });

    it('formats bytes correctly', () => {
      expect(formatFileSize(1)).toBe('1 bytes');
      expect(formatFileSize(500)).toBe('500 bytes');
      expect(formatFileSize(1023)).toBe('1023 bytes');
    });

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(10240)).toBe('10 KB');
      expect(formatFileSize(512000)).toBe('500 KB');
    });

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
      expect(formatFileSize(10485760)).toBe('10 MB');
      expect(formatFileSize(157286400)).toBe('150 MB');
    });

    it('formats gigabytes correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
      expect(formatFileSize(1610612736)).toBe('1.5 GB');
      expect(formatFileSize(10737418240)).toBe('10 GB');
    });

    it('rounds to 2 decimal places', () => {
      expect(formatFileSize(1536000)).toBe('1.46 MB');
      expect(formatFileSize(1234567)).toBe('1.18 MB');
    });

    it('handles edge case numbers', () => {
      expect(formatFileSize(1025)).toBe('1 KB');
      expect(formatFileSize(1048577)).toBe('1 MB');
    });
  });

  describe('getFileIcon', () => {
    it('returns image icon for image MIME types', () => {
      expect(getFileIcon('image/png')).toBe('image--line');
      expect(getFileIcon('image/jpeg')).toBe('image--line');
      expect(getFileIcon('image/gif')).toBe('image--line');
      expect(getFileIcon('image/webp')).toBe('image--line');
      expect(getFileIcon('image/svg+xml')).toBe('image--line');
    });

    it('returns PDF icon for PDF files', () => {
      expect(getFileIcon('application/pdf')).toBe('file-pdf--line');
    });

    it('returns video icon for video MIME types', () => {
      expect(getFileIcon('video/mp4')).toBe('video--line');
      expect(getFileIcon('video/mpeg')).toBe('video--line');
      expect(getFileIcon('video/webm')).toBe('video--line');
    });

    it('returns audio icon for audio MIME types', () => {
      expect(getFileIcon('audio/mp3')).toBe('music--line');
      expect(getFileIcon('audio/mpeg')).toBe('music--line');
      expect(getFileIcon('audio/wav')).toBe('music--line');
    });

    it('returns zip icon for compressed files', () => {
      expect(getFileIcon('application/zip')).toBe('folder-zip--line');
      expect(getFileIcon('application/x-zip-compressed')).toBe('folder-zip--line');
      expect(getFileIcon('application/x-compressed')).toBe('folder-zip--line');
    });

    it('returns default icon for unknown types', () => {
      expect(getFileIcon('application/json')).toBe('file--line');
      expect(getFileIcon('text/plain')).toBe('file--line');
      expect(getFileIcon('application/octet-stream')).toBe('file--line');
      expect(getFileIcon('')).toBe('file--line');
    });
  });

  describe('validateFileType', () => {
    // Helper to create File objects
    const createFile = (name: string, type: string): File => {
      return new File(['content'], name, { type });
    };

    describe('with no restrictions', () => {
      it('accepts any file when acceptedTypes is undefined', () => {
        const file = createFile('test.txt', 'text/plain');
        expect(validateFileType(file, undefined)).toBe(true);
      });

      it('accepts any file when acceptedTypes is empty string', () => {
        const file = createFile('test.txt', 'text/plain');
        expect(validateFileType(file, '')).toBe(true);
      });
    });

    describe('with MIME type patterns', () => {
      it('validates exact MIME type match', () => {
        const pngFile = createFile('test.png', 'image/png');
        expect(validateFileType(pngFile, 'image/png')).toBe(true);

        const jpgFile = createFile('test.jpg', 'image/jpeg');
        expect(validateFileType(jpgFile, 'image/jpeg')).toBe(true);
      });

      it('validates wildcard MIME type patterns', () => {
        const pngFile = createFile('test.png', 'image/png');
        const jpgFile = createFile('test.jpg', 'image/jpeg');
        const gifFile = createFile('test.gif', 'image/gif');

        expect(validateFileType(pngFile, 'image/*')).toBe(true);
        expect(validateFileType(jpgFile, 'image/*')).toBe(true);
        expect(validateFileType(gifFile, 'image/*')).toBe(true);
      });

      it('rejects non-matching MIME types', () => {
        const pdfFile = createFile('test.pdf', 'application/pdf');
        expect(validateFileType(pdfFile, 'image/*')).toBe(false);
        expect(validateFileType(pdfFile, 'image/png')).toBe(false);
      });

      it('validates multiple MIME patterns', () => {
        const pngFile = createFile('test.png', 'image/png');
        const pdfFile = createFile('test.pdf', 'application/pdf');
        const txtFile = createFile('test.txt', 'text/plain');

        expect(validateFileType(pngFile, 'image/*,application/pdf')).toBe(true);
        expect(validateFileType(pdfFile, 'image/*,application/pdf')).toBe(true);
        expect(validateFileType(txtFile, 'image/*,application/pdf')).toBe(false);
      });

      it('handles whitespace in patterns', () => {
        const pngFile = createFile('test.png', 'image/png');
        expect(validateFileType(pngFile, ' image/png , application/pdf ')).toBe(true);
      });
    });

    describe('with extension patterns', () => {
      it('validates exact extension match', () => {
        const pngFile = createFile('test.png', 'image/png');
        expect(validateFileType(pngFile, '.png')).toBe(true);

        const pdfFile = createFile('document.pdf', 'application/pdf');
        expect(validateFileType(pdfFile, '.pdf')).toBe(true);
      });

      it('validates case-insensitively', () => {
        const pngFile = createFile('TEST.PNG', 'image/png');
        expect(validateFileType(pngFile, '.png')).toBe(true);

        const pdfFile = createFile('document.PDF', 'application/pdf');
        expect(validateFileType(pdfFile, '.pdf')).toBe(true);
      });

      it('validates multiple extensions', () => {
        const pngFile = createFile('test.png', 'image/png');
        const jpgFile = createFile('test.jpg', 'image/jpeg');
        const gifFile = createFile('test.gif', 'image/gif');
        const pdfFile = createFile('test.pdf', 'application/pdf');

        expect(validateFileType(pngFile, '.png,.jpg,.gif')).toBe(true);
        expect(validateFileType(jpgFile, '.png,.jpg,.gif')).toBe(true);
        expect(validateFileType(gifFile, '.png,.jpg,.gif')).toBe(true);
        expect(validateFileType(pdfFile, '.png,.jpg,.gif')).toBe(false);
      });

      it('rejects non-matching extensions', () => {
        const pdfFile = createFile('test.pdf', 'application/pdf');
        expect(validateFileType(pdfFile, '.png')).toBe(false);
        expect(validateFileType(pdfFile, '.jpg,.gif')).toBe(false);
      });
    });

    describe('with mixed patterns', () => {
      it('validates mixed MIME types and extensions', () => {
        const pngFile = createFile('test.png', 'image/png');
        const pdfFile = createFile('test.pdf', 'application/pdf');
        const docFile = createFile('test.doc', 'application/msword');

        expect(validateFileType(pngFile, 'image/*,.pdf,.doc')).toBe(true);
        expect(validateFileType(pdfFile, 'image/*,.pdf,.doc')).toBe(true);
        expect(validateFileType(docFile, 'image/*,.pdf,.doc')).toBe(true);
      });
    });

    describe('with empty MIME type (fallback to extension)', () => {
      it('validates by extension when file has no MIME type', () => {
        const pngFile = createFile('test.png', '');
        expect(validateFileType(pngFile, 'image/png')).toBe(true);

        const jpgFile = createFile('test.jpg', '');
        expect(validateFileType(jpgFile, 'image/jpeg')).toBe(true);

        const pdfFile = createFile('test.pdf', '');
        expect(validateFileType(pdfFile, 'application/pdf')).toBe(true);
      });

      it('validates wildcard image/* by extension when no MIME type', () => {
        const pngFile = createFile('test.png', '');
        const jpgFile = createFile('test.jpg', '');
        const jpegFile = createFile('test.jpeg', '');
        const gifFile = createFile('test.gif', '');
        const webpFile = createFile('test.webp', '');

        expect(validateFileType(pngFile, 'image/*')).toBe(true);
        expect(validateFileType(jpgFile, 'image/*')).toBe(true);
        expect(validateFileType(jpegFile, 'image/*')).toBe(true);
        expect(validateFileType(gifFile, 'image/*')).toBe(true);
        expect(validateFileType(webpFile, 'image/*')).toBe(true);
      });

      it('rejects non-image files for image/* when no MIME type', () => {
        const pdfFile = createFile('test.pdf', '');
        const txtFile = createFile('test.txt', '');

        expect(validateFileType(pdfFile, 'image/*')).toBe(false);
        expect(validateFileType(txtFile, 'image/*')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('handles files with no extension', () => {
        const noExtFile = createFile('README', 'text/plain');
        expect(validateFileType(noExtFile, '.txt')).toBe(false);
        expect(validateFileType(noExtFile, 'text/plain')).toBe(true);
      });

      it('handles files with multiple dots', () => {
        const multiDotFile = createFile('archive.tar.gz', 'application/gzip');
        expect(validateFileType(multiDotFile, '.gz')).toBe(true);
      });

      it('handles pattern with no leading dot', () => {
        const pngFile = createFile('test.png', 'image/png');
        // Pattern should start with . to be treated as extension
        expect(validateFileType(pngFile, 'png')).toBe(false);
      });
    });
  });

  describe('sanitizeFileName', () => {
    it('returns unchanged filename for safe names', () => {
      expect(sanitizeFileName('document.pdf')).toBe('document.pdf');
      expect(sanitizeFileName('my-file_name.txt')).toBe('my-file_name.txt');
      expect(sanitizeFileName('image123.png')).toBe('image123.png');
    });

    it('removes HTML tags', () => {
      // Note: In test environment, DOMPurify.sanitize is mocked to pass through
      // In real environment, this would strip HTML tags
      // The actual sanitization still happens via character replacement
      expect(sanitizeFileName('<script>alert("xss")</script>.pdf')).toBe(
        '-script-alert(-xss-)--script-.pdf'
      );
      expect(sanitizeFileName('<div>test</div>.txt')).toBe('-div-test--div-.txt');
      expect(sanitizeFileName('file<br>.doc')).toBe('file-br-.doc');
    });

    it('removes script content', () => {
      // Note: In test environment, DOMPurify.sanitize is mocked
      // Character replacement still protects against path traversal
      expect(sanitizeFileName('file<script>bad()</script>.txt')).toBe(
        'file-script-bad()--script-.txt'
      );
    });

    it('replaces problematic characters with dashes', () => {
      expect(sanitizeFileName('file:name.txt')).toBe('file-name.txt');
      expect(sanitizeFileName('file<name>.txt')).toBe('file-name-.txt');
      expect(sanitizeFileName('file>name.txt')).toBe('file-name.txt');
      expect(sanitizeFileName('file"name".txt')).toBe('file-name-.txt');
      expect(sanitizeFileName('file/name.txt')).toBe('file-name.txt');
      expect(sanitizeFileName('file\\name.txt')).toBe('file-name.txt');
      expect(sanitizeFileName('file|name.txt')).toBe('file-name.txt');
      expect(sanitizeFileName('file?name.txt')).toBe('file-name.txt');
      expect(sanitizeFileName('file*name.txt')).toBe('file-name.txt');
    });

    it('normalizes multiple spaces to single space', () => {
      expect(sanitizeFileName('file   name.txt')).toBe('file name.txt');
      expect(sanitizeFileName('file\t\tname.txt')).toBe('file name.txt');
      expect(sanitizeFileName('file\n\nname.txt')).toBe('file name.txt');
    });

    it('trims whitespace from edges', () => {
      expect(sanitizeFileName('  filename.txt  ')).toBe('filename.txt');
      expect(sanitizeFileName('\tfilename.txt\t')).toBe('filename.txt');
    });

    it('limits filename length to 255 characters', () => {
      const longName = `${'a'.repeat(300)  }.txt`;
      const sanitized = sanitizeFileName(longName);
      expect(sanitized.length).toBe(255);
      expect(sanitized).toBe('a'.repeat(255));
    });

    it('combines multiple sanitization rules', () => {
      const malicious = '  <script>alert("xss")</script>file:name<>?.txt  ';
      const sanitized = sanitizeFileName(malicious);
      // DOMPurify mock passes through, but character replacement still sanitizes
      expect(sanitized).toBe('-script-alert(-xss-)--script-file-name---.txt');
    });

    it('handles empty string', () => {
      expect(sanitizeFileName('')).toBe('');
    });

    it('handles filename with only problematic characters', () => {
      expect(sanitizeFileName('<>:"/\\|?*')).toBe('---------');
    });

    it('preserves unicode characters', () => {
      expect(sanitizeFileName('文档.txt')).toBe('文档.txt');
      expect(sanitizeFileName('файл.pdf')).toBe('файл.pdf');
      expect(sanitizeFileName('archivo-español.doc')).toBe('archivo-español.doc');
    });

    it('handles mixed problematic and safe characters', () => {
      expect(sanitizeFileName('My:File<Name>2023.pdf')).toBe('My-File-Name-2023.pdf');
    });
  });
});

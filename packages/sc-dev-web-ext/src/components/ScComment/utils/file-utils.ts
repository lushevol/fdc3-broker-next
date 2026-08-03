/**
 * Utility functions for file attachment handling
 * 
 * @module file-utils
 */

import DOMPurify from 'dompurify';

/**
 * Format file size from bytes to human-readable string
 * 
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "234 KB")
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536000) // "1.46 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 bytes';
  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100  } ${  sizes[i]}`;
}

/**
 * Get appropriate icon name for file type
 * 
 * @param fileType - MIME type of the file
 * @returns Icon name from @scdevkit/icons
 * 
 * @example
 * getFileIcon('image/png') // "image--line"
 * getFileIcon('application/pdf') // "file-pdf--line"
 * getFileIcon('text/plain') // "file--line"
 */
export function getFileIcon(fileType: string): string {
  if (fileType.startsWith('image/')) return 'image--line';
  if (fileType === 'application/pdf') return 'file-pdf--line';
  if (fileType.startsWith('video/')) return 'video--line';
  if (fileType.startsWith('audio/')) return 'music--line';
  if (fileType.includes('zip') || fileType.includes('compressed')) {
    return 'folder-zip--line';
  }
  return 'file--line'; // default
}

/**
 * Validate file type against accepted types pattern
 * 
 * @param file - File object to validate
 * @param acceptedTypes - Accept attribute pattern (e.g., "image/*,.pdf")
 * @returns True if file type is accepted
 * 
 * @example
 * validateFileType(file, 'image/*') // true for PNG, JPG, etc.
 * validateFileType(file, '.pdf,.doc') // true only for PDF and DOC
 */
export function validateFileType(
  file: File,
  acceptedTypes?: string
): boolean {
  if (!acceptedTypes) return true; // No restrictions
  
  const patterns = acceptedTypes.split(',').map(p => p.trim());
  
  for (const pattern of patterns) {
    // Handle MIME type patterns (e.g., "image/*", "image/png")
    if (pattern.includes('/')) {
      // If file has a MIME type, check it
      if (file.type) {
        if (pattern.endsWith('/*')) {
          const prefix = pattern.slice(0, -2);
          if (file.type.startsWith(prefix)) return true;
        } else if (file.type === pattern) {
          return true;
        }
      }
      // If file has no MIME type, try to infer from extension
      else {
        // Extract extension from pattern (e.g., "image/png" -> ".png")
        const mimeToExt: Record<string, string> = {
          'image/png': '.png',
          'image/jpeg': '.jpg',
          'image/jpg': '.jpg',
          'image/gif': '.gif',
          'image/webp': '.webp',
          'application/pdf': '.pdf',
          'text/plain': '.txt',
        };
        const ext = mimeToExt[pattern];
        if (ext && file.name.toLowerCase().endsWith(ext)) {
          return true;
        }
        // For wildcard patterns like "image/*", check common extensions
        if (pattern.endsWith('/*')) {
          const prefix = pattern.slice(0, -2);
          if (prefix === 'image') {
            const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];
            if (imageExts.some(ext => file.name.toLowerCase().endsWith(ext))) {
              return true;
            }
          }
        }
      }
    }
    // Handle extension patterns (e.g., ".pdf", ".png")
    else if (pattern.startsWith('.')) {
      if (file.name.toLowerCase().endsWith(pattern.toLowerCase())) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Sanitize file name to prevent XSS and ensure safe display
 * 
 * @param fileName - Original file name
 * @returns Sanitized file name
 * 
 * @example
 * sanitizeFileName('<script>alert("xss")</script>.pdf') // "alert-xss-.pdf"
 */
export function sanitizeFileName(fileName: string): string {
  // Use DOMPurify to remove any HTML/script content
  const sanitized = DOMPurify.sanitize(fileName, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  
  // Replace potentially problematic characters
  return sanitized
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 255); // Limit length
}

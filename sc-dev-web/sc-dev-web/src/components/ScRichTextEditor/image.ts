import { editorCommand } from './core/utils.js';

/**
 * The image will be converted to a base64 string and inserted into the editor.
 * insertImage action is part of execCommand API.
 */
export const handleImageUpload = (maxImageSize: number) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event: Event) => handleOnChange(event, maxImageSize);
  input.click();
};

export const handleOnChange = (event: Event, maxImageSize: number) => {
  const target = event.target as HTMLInputElement;
  if (target?.files && target.files.length > 0) {
    const file = target.files[0];
    const fileSize = Math.round(file.size / 1024);
    if (fileSize >= maxImageSize) {
      alert(
        `Image too big, please select a file less than ${Math.round(
          maxImageSize / 1024
        )}MB`
      );
      return;
    }
    const reader = new FileReader();
    // Read the file as base64 string
    reader.onloadend = () => {
      // Ensure base64String is of type string
      const base64String = reader.result as string;
      editorCommand('insertImage', base64String);
    };
    reader.readAsDataURL(file);
  }
};

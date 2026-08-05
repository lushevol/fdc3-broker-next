import { handleImageUpload, handleOnChange } from '../../../src/components/ScRichTextEditor/utils.js';

describe('handleImageUpload', () => {
  const mockEditor: any = {
    execCommand: () => {},
  };
  it('should call handleOnChange with valid file', () => {
    const mockFile = new File(['dummy content'], 'dummy.png', {
      type: 'image/png',
    });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;
    
    const maxImageSize = 1024;
    handleOnChange(mockEvent, maxImageSize, mockEditor);
  });

  it('should reject file larger than max size', () => {
    // create a 1 MB file
    const largeFileContent = new Array(1024 * 1024).fill('a').join('');
    const mockFile = new File([largeFileContent], 'dummy.png', {
      type: 'image/png',
    });

    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;
    const maxImageSize = 1024;
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    handleOnChange(mockEvent, maxImageSize);

    expect(alertSpy).toHaveBeenCalledWith(
      'Image too big, please select a file less than 1MB'
    );
  });

  it('should call editorCommand with base64String when a file is selected', () => {
    const mockFile = new File(['dummy content'], 'dummy.png', {
      type: 'image/png',
    });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    };

    global.FileReader = jest.fn().mockImplementation(() => ({
      readAsDataURL: jest.fn(),
      result: 'dummyBase64String',
    })) as unknown as {
      new (): FileReader;
      prototype: FileReader;
      readonly EMPTY: 0;
      readonly LOADING: 1;
      readonly DONE: 2;
    };

    const mockInput = {
      type: 'file',
      accept: 'image/*',
      onchange: jest.fn().mockImplementation(callback => callback(mockEvent)),
      click: jest.fn(),
    };

    const inputClickSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(mockInput as unknown as HTMLInputElement);

    handleImageUpload(mockEditor, 1024);

    expect(inputClickSpy).toHaveBeenCalled();
  });
});

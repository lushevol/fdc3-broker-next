import { handleImageUpload } from '../../../src/components/ScRichTextEditor/utils.js';

describe('handleImageUpload', () => {
  it('should call editorCommand with base64String when a file is selected', () => {
    const mockFile = new File(['dummy content'], 'dummy.png', {
      type: 'image/png',
    });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    };

    const mockEditor: any = {
      execCommand: () => {},
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

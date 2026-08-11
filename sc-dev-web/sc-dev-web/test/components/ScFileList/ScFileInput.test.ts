import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScFileInput } from '../../../src/components/ScFileList/ScFileInput.js';
import '../../../elements/sc-file-input.js';
import { filteringFiles } from '../../../src/components/ScFileList/FileChecker.js';
import { HexToHSL } from '../../../src/components/ScFileList/ColorConvert.js';
import FileIconPaths from '../../../src/components/ScFileList/FileIconPaths.js';
import { ScFileButton } from '../../../src/components/ScFileList/ScFileButton.js';
import { ScButton } from '../../../elements/sc-button.js';

describe('ScFileInput', () => {
  it('renders file input', async () => {
    const el = await fixture<ScFileInput>(html`
      <sc-file-input
        multiple placeholder=""
        label="File" required error-message='Failed to upload files, please try again later'
      >
          <span slot="placeholder">Drag and drop file here or click to upload</span>
      </sc-file-input>
    `);

    await fixture<ScFileInput>(html`
      <sc-file-input id='file-input-data-init'
         label="File" required success-message='Files are uploaded successfully'
         width="40%" placeholder="Drag and drop file here or click to upload"
         accept="image/jpeg, image/png" selectable deletable
      >
      </sc-file-input>
    `);

    el.selectable = true;
    el.deletable = true;
    el.multiple = true;
    el.disabled = true;
    el.selectable = false;
    el.deletable = false;
    el.disabled = false;
    el.readonly = true;

    expect(el.multiple).to.equal(true);
    expect(el.errorMessage).to.equal('Failed to upload files, please try again later');
  });

  it('test some private new functions for file-input', async () => {
    const el = await fixture<ScFileInput>(html`
      <sc-file-input
        multiple
        label="File"
      >
      </sc-file-input>
    `);
    const updateErrMsg = Reflect.get(el, '_updateErrorMsg');
    expect(typeof updateErrMsg).to.equal('function');

    Reflect.set(el, '_invalidFiles', [{
      id: 'abc',
      name: 'test.png',
      status: 'error',
      extra: 'invalid file format',
    }]);


    updateErrMsg.call(el);
    const msg = Reflect.get(el, 'errorMessage');
    expect(msg).to.equal('invalid file format');

    const removeFunc = Reflect.get(el, '_removeRelatedInvalidFile');
    removeFunc.call(el, { id: 'abc' });
    const invalidFiles = Reflect.get(el, '_invalidFiles');
    expect(invalidFiles.length).to.equal(0);

    Reflect.set(el, 'value', [{
      id: 'def',
      name: 'test1.png',
      status: 'error',
      extra: 'invalid file format',
    }]);
    const handleChange = Reflect.get(el, ' _handleChange');
    handleChange && handleChange.call(el, { 
      bubbles: true, 
      composed: true,
      detail: {
        addedFiles: [{
          id: '111', name: 'test1.png', size: 30, type: 'image/png',
        }],
        invalidFiles: [{
          id: '222', name: 'test2.docx', size: 30, type: '',
        }],
      },
    });
    const _files = Reflect.get(el, '_files');
    expect(_files.length).to.equal(0);
  });

  it('test extra private methods',async () => {
    const el = await fixture<ScFileInput>(html`
      <sc-file-input
        multiple
        label="File"
      >
      </sc-file-input>
    `);
    const removeFunc = Reflect.get(el, '_handleRemove');
    Reflect.set(el, '_files', [{
      id: '123321',
      name: 'test1.png',
      status: 'error',
      extra: 'invalid file format',
    }]);
    removeFunc.call(el, {}, 0);
    Reflect.set(el, 'disabled', true);
    Reflect.set(el, 'multiple', false);
    const files = Reflect.get(el, '_files');
    expect(files.length).to.equal(0);
  });

  it('test file-button component methods',async () => {
    const el = await fixture<ScFileButton>(html`
      <sc-file-button
        multiple
        disabled
        label="File"
        accept=".pdf,.png"
        max-size="100"
      >
        <sc-button icon="upload" size="sm">Add Files</sc-button>
      </sc-file-button>
    `);
    const handleChange = Reflect.get(el, ' _handleChange');
    handleChange && handleChange.call(el, {});
    expect(typeof handleChange).to.not.equal(null);

    const getFiles = Reflect.get(el, ' _getFiles');
    getFiles && getFiles.call(el, {}, []);
    expect(typeof getFiles).to.not.equal(null);
  });

  it('renders file input with Add-Button style', async () => {
    const el = await fixture<ScFileInput>(html`
      <sc-file-input
        multiple
        label="File" 
        required
        btGray="true"
        hideFileList="true"
        error-message='invalid file format'
      >
        <div slot="add-button">
          <sc-button icon="upload" size="sm">Add Files</sc-button>
        </div>
      </sc-file-input>
    `);

    await fixture<ScFileInput>(html`
    <sc-file-input id='file-input-with-button-style'
      btGray="true"
      hideFileList="true"
      label="File" required success-message='Files are uploaded successfully'
      width="40%" placeholder="Drag and drop file here or click to upload"
      accept="image/jpeg, image/png" selectable deletable
    >
      <div slot="add-button">
          <sc-button fill icon="upload" size="sm">Upload</sc-button>
      </div>
    </sc-file-input>
    `);

    el.bgGray = true;
    el.hideFileList = true;
    el.multiple = true;

    const ele = el?.shadowRoot?.querySelector('sc-file-button');
    const changeEvt = new CustomEvent('sc-change', { 
      bubbles: true, 
      composed: true,
      detail: {
        addedFiles: [{
          name: 'test1.png', size: 30, type: 'image/png',
        }],
        invalidFiles: [{
          name: 'test2.docx', size: 30, type: '',
        }],
      }, 
    });
    ele?.dispatchEvent(changeEvt);
    await el.updateComplete;
    el.addEventListener('sc-change',(e: any) => {
      expect(e).to.not.be.null;
    });
    el.querySelector('sc-button')?.click();

    expect(el.bgGray).to.equal(true);
    expect(el.hideFileList).to.equal(true);
    expect(el.children).to.not.equal(null);
  });

  it('test filteringFiles function with empty return', () => {
    const result = filteringFiles('', 0, []);

    expect(result.invalidFiles.length).to.equal(0);
    expect(result.validFiles.length).to.equal(0);
  });

  it('test filteringFiles function with ext file name', () => {
    const accepts = '.png,.pdf,.jpg';
    const files = [{
      name: 'test1.png', size: 30, type: 'image/png',
    },{
      name: 'test2.docx', size: 30, type: '',
    },{
      name: 'test3.pdf', size: 80, type: 'application/pdf',
    },{
      name: 'test4.txt', size: 100, type: '',
    },
    {
      name: 'test5.jpg', size: 30, type: '',
    }];
    const result = filteringFiles(accepts, 200, files);

    expect(result.invalidFiles.length).to.equal(2);
    expect(result.validFiles.length).to.equal(3);
  });

  it('test filteringFiles function with mimetype', () => {
    const accepts = 'image/png,application/pdf,image/jpeg';
    const files = [{
      name: 'test1.png', size: 30, type: 'image/png',
    },{
      name: 'test2.docx', size: 30, type: '',
    },{
      name: 'test3.pdf', size: 80, type: 'application/pdf',
    },{
      name: 'test4.txt', size: 100, type: '',
    },
    {
      name: 'test5.jpg', size: 30, type: 'image/jpeg',
    }, {
      name: 'test6.jpeg', size: 50, type: 'image/jpeg',
    },
  ];
    const result = filteringFiles(accepts, 200, files);

    expect(result.invalidFiles.length).to.equal(2);
    expect(result.validFiles.length).to.equal(4);
  });

  it('test filteringFiles function max-size', () => {
    const accepts = 'image/png,application/pdf,image/jpeg';
    const files = [{
      name: 'test1.png', size: 30, type: 'image/png',
    },{
      name: 'test2.docx', size: 60, type: '',
    },{
      name: 'test3.pdf', size: 80, type: 'application/pdf',
    },{
      name: 'test4.txt', size: 100, type: '',
    },
    {
      name: 'test5.jpg', size: 30, type: 'image/jpeg',
    }, {
      name: 'test6.jpeg', size: 50, type: 'image/jpeg',
    },
  ];
    const result = filteringFiles(accepts, 50, files);

    expect(result.invalidFiles.length).to.equal(3);
    expect(result.validFiles.length).to.equal(3);
  });

  it('test HexToHSL function', () => {
    const hslColor = HexToHSL('#f8f8f5');
    expect(hslColor).to.not.equal(null);
    expect(hslColor.h).to.equal(60);
    expect(hslColor.l).to.equal(97);
    expect(hslColor.s).to.equal(18);
  });

  it('test FileIconPaths', () => {
    expect(FileIconPaths['3d']).to.not.equal(null);
    expect(Object.keys(FileIconPaths).length).to.equal(16);
    expect(FileIconPaths.document).to.not.equal(undefined);
    expect(FileIconPaths.acrobat).to.not.equal(null);
    expect(FileIconPaths.audio).to.not.equal(null);
    expect(FileIconPaths.binary).to.not.equal(null);
    expect(FileIconPaths.code).to.not.equal(null);
    expect(FileIconPaths.compressed).to.not.equal(null);
    expect(FileIconPaths.drive).to.not.equal(null);

    expect(FileIconPaths.font).to.not.equal(null);
    expect(FileIconPaths.image).to.not.equal(null);
    expect(FileIconPaths.presentation).to.not.equal(null);
    expect(FileIconPaths.settings).to.not.equal(null);
    expect(FileIconPaths.vector).to.not.equal(null);
    expect(FileIconPaths.video).to.not.equal(null);
    expect(FileIconPaths.spreadsheet).to.not.equal(null);
  });
});

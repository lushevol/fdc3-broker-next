import { expect, fixture, html } from '@open-wc/testing';
import {
  ScDropdownInput,
  TData,
} from '../../../src/components/ScDropdown/ScDropdownInput.js';
import '../../../elements/sc-dropdown-input.js';
import { pieceOfData } from './utils.js';

const iterateData = (
  data: TData[],
  cb: (item: TData, index: number, previousItem?: TData) => void
) => {
  let i = 0;
  const fn = (_data: TData[], previousItem?: TData) => {
    _data.forEach((d: TData) => {
      cb(d, i++, previousItem);
      if (d.children?.length) {
        fn(d.children, d);
      }
    });
  };
  fn(data);
};

describe('dropdown unit testing', () => {
  let dropdown: ScDropdownInput;
  beforeEach(async () => {
    dropdown = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input></sc-dropdown-input>
    `);
  });

  it('getLevel', async () => {
    expect(dropdown.getLevel('0')).to.equal(0);
    expect(dropdown.getLevel('0-0-0-0')).to.equal(90);
  });
  it('replaceTag', async () => {
    expect(dropdown.replaceTag('<h1><div>hello world</div></h1>')).to.equal(
      'hello world'
    );
    expect(
      dropdown.replaceTag(
        '<div>hello<p>+</p><h1><span>w</span><b>o</b><strong>r</strong><em>l</em><article>d</article><br></h1></div>'
      )
    ).to.equal('hello+world');
  });

  describe('no children', () => {
    let data: TData[];
    beforeEach(async () => {
      data = [pieceOfData(), pieceOfData(true)];
    });

    it('reCompile', async () => {
      const compiledRes = data.map(item => dropdown.reCompile(item));
      expect(compiledRes[0].startsWith('label')).to.equal(true);
      expect(compiledRes[1].startsWith('<h1>label')).to.equal(true);
      expect(compiledRes[1].endsWith('</h1>')).to.equal(true);
    });
    it('updateImmutableDropdownOptions', async () => {
      dropdown.updateImmutableDropdownOptions(data);

      let isValid = true;
      const options = [...dropdown.immutableDropdownOptions];

      iterateData(data, (item, i) => {
        const option = options[i];
        if (item.value !== option.value) {
          isValid = false;
        }
        if (item.label !== option.label) {
          isValid = false;
        }
        if (+option.path !== i) {
          isValid = false;
        }
        if (option.parentPath) {
          isValid = false;
        }
      });

      expect(isValid).to.equal(true);
      expect(dropdown.dropdownOptionsWithIndex.size).to.equal(0);
      dropdown.updateIndexDropdownOptions(dropdown.immutableDropdownOptions);
      expect(dropdown.dropdownOptionsWithIndex.size).to.equal(2);
    });
  });

  describe('has children', () => {
    let data: TData[];
    beforeEach(async () => {
      data = [pieceOfData(false, 2, 2), pieceOfData(true, 1, 1)];
    });
    it('updateImmutableDropdownOptions', async () => {
      dropdown.updateImmutableDropdownOptions(data);

      let isValid = true;
      const options = [...dropdown.immutableDropdownOptions];

      iterateData(data, (item, i) => {
        const option = options[i];
        if (item.value !== option.value) {
          isValid = false;
        }
        if (item.label !== option.label) {
          isValid = false;
        }
        if (option.path.includes('-')) {
          if (!option.parentPath) {
            isValid = false;
          }
        }
      });

      expect(isValid).to.equal(true);

      expect(dropdown.dropdownOptionsWithIndex.size).to.equal(0);
      dropdown.updateIndexDropdownOptions(dropdown.immutableDropdownOptions);
      expect(dropdown.dropdownOptionsWithIndex.size).to.equal(2);
      dropdown.activePath = new Set(['0-0']);
      dropdown.updateIndexDropdownOptions(dropdown.immutableDropdownOptions);
      expect(dropdown.dropdownOptionsWithIndex.size).to.equal(4);
    });
  });
});

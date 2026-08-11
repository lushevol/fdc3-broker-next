import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScFormattedInput } from '../../../src/components/ScFormInput/ScFormattedInput.js';
import '../../../elements/sc-formatted-input.js';

describe('ScFormattedInput', () => {
  it('renders default value input', async () => {
    const el = await fixture<ScFormattedInput>(
      html` <sc-formatted-input label="Default value input label"></sc-formatted-input>`
    );
    expect(el.label).to.equal('Default value input label');
  });

  it('custom format', async () => {
    const el = await fixture<ScFormattedInput>(
      html` <sc-formatted-input format='\w+@sc\.com'>
        Custom format
      </sc-formatted-input>`
    );
    expect(el.format).to.equal('\w+@sc\.com');
  });

  it('renders blocks', async () => {
    const el = await fixture<ScFormattedInput>(
      html` <sc-formatted-input blocks='2,3,4'>
        Set blocks
      </sc-formatted-input>`
    );
    expect(el.blocks).to.equal('2,3,4');
    expect(el.delimiter).to.equal(' - ');
  });

  it('renders delimiter', async () => {
    const el = await fixture<ScFormattedInput>(
      html` <sc-formatted-input delimiter='&'>
        Set delimiter
      </sc-formatted-input>`
    );
    expect(el.delimiter).to.equal('&');
  });

  it('call handleInput', async () => {
    const el = await fixture<ScFormattedInput>(
      html` <sc-formatted-input delimiter='&' blocks='2,2,3'>
        Set delimiter
      </sc-formatted-input>`
    );
    el.handleInput({
      detail: {
        value: '12234',
      },
    });
    expect(el.value).to.equal('12&23&4');
  });

  it('call handleInput with format', async () => {
    const el = await fixture<ScFormattedInput>(
      html` <sc-formatted-input format='\\d+'>
        Format
      </sc-formatted-input>`
    );
    el.handleInput({
      detail: {
        value: '12234a',
      },
    });
    expect(el.value).to.equal('12234a');
  });
  it('call handleInput with error', async () => {
    const el = await fixture<ScFormattedInput>(
      html` <sc-formatted-input auto-show-error format='\\d+'>
        Format
      </sc-formatted-input>`
    );
    el.handleInput({
      detail: {
        value: '',
      },
    });
    el.handleInput({
      detail: {
        value: '12234a',
      },
    });
    expect(el.value).to.equal('12234a');
  });
});

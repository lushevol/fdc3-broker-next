import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTag } from '../../src/components/ScTag/ScTag.js';
import '../../elements/sc-tag.js';

describe('ScTag', () => {
  it('renders default tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="default"></sc-tag>`);

    expect(el.type).to.equal('default');
  });

  it('renders default filled tag', async () => {
    const el = await fixture<ScTag>(
      html`<sc-tag type="default" mode='filled'></sc-tag>`
    );

    expect(el.type).to.equal('default');
  });

  it('renders default disabled tag', async () => {
    const el = await fixture<ScTag>(
      html`<sc-tag type="default" disabled></sc-tag>`
    );

    expect(el.type).to.equal('default');
  });

  it('renders default link tag', async () => {
    const el = await fixture<ScTag>(
      html`<sc-tag type="default" mode='link'></sc-tag>`
    );

    expect(el.type).to.equal('default');
  });

  it('renders primary tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="primary"></sc-tag>`);

    expect(el.type).to.equal('primary');
  });

  it('renders primary filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="primary" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('primary');
  });

  it('renders primary disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="primary" disabled></sc-tag>`);

    expect(el.type).to.equal('primary');
  });

  it('renders primary link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="primary" mode='link'></sc-tag>`);

    expect(el.type).to.equal('primary');
  });

  it('renders success tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="success"></sc-tag>`);

    expect(el.type).to.equal('success');
  });

  it('renders success filled tag', async () => {
    const el = await fixture<ScTag>(
      html`<sc-tag type="success" mode='filled'></sc-tag>`
    );

    expect(el.type).to.equal('success');
  });

  it('renders success disabled tag', async () => {
    const el = await fixture<ScTag>(
      html`<sc-tag type="success" disabled></sc-tag>`
    );

    expect(el.type).to.equal('success');
  });

  it('renders success link tag', async () => {
    const el = await fixture<ScTag>(
      html`<sc-tag type="success" mode='link'></sc-tag>`
    );

    expect(el.type).to.equal('success');
  });

  it('renders warning tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="warning"></sc-tag>`);

    expect(el.type).to.equal('warning');
  });

  it('renders warning filled tag', async () => {
    const el = await fixture<ScTag>(
      html`<sc-tag type="warning" mode='filled'></sc-tag>`
    );

    expect(el.type).to.equal('warning');
  });

  it('renders warning disabled tag', async () => {
    const el = await fixture<ScTag>(
      html`<sc-tag type="warning" disabled></sc-tag>`
    );

    expect(el.type).to.equal('warning');
  });

  it('renders warning link tag', async () => {
    const el = await fixture<ScTag>(
      html`<sc-tag type="warning" mode='link'></sc-tag>`
    );

    expect(el.type).to.equal('warning');
  });

  it('renders error tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="error"></sc-tag>`);

    expect(el.type).to.equal('error');
  });

  it('renders error filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="error" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('error');
  });

  it('renders error disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="error" disabled></sc-tag>`);

    expect(el.type).to.equal('error');
  });

  it('renders error link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="error" mode='link'></sc-tag>`);

    expect(el.type).to.equal('error');
  });

  it('renders transparent tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="transparent"></sc-tag>`);

    expect(el.type).to.equal('transparent');
  });

  it('renders transparent filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="transparent" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('transparent');
  });

  it('renders transparent disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="transparent" disabled></sc-tag>`);

    expect(el.type).to.equal('transparent');
  });

  it('renders transparent link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="transparent" mode='link'></sc-tag>`);

    expect(el.type).to.equal('transparent');
  });

  it('renders disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="disabled"></sc-tag>`);

    expect(el.type).to.equal('disabled');
  });

  it('renders disabled filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="disabled" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('disabled');
  });

  it('renders disabled disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="disabled" disabled></sc-tag>`);

    expect(el.type).to.equal('disabled');
  });

  it('renders disabled link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="disabled" mode='link'></sc-tag>`);

    expect(el.type).to.equal('disabled');
  });

  it('renders blue tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="blue"></sc-tag>`);

    expect(el.type).to.equal('blue');
  });

  it('renders blue filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="blue" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('blue');
  });

  it('renders blue disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="blue" disabled></sc-tag>`);

    expect(el.type).to.equal('blue');
  });

  it('renders blue link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="blue" mode='link'></sc-tag>`);

    expect(el.type).to.equal('blue');
  });

  it('renders dark-blue tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="dark-blue"></sc-tag>`);

    expect(el.type).to.equal('dark-blue');
  });

  it('renders dark-blue filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="dark-blue" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('dark-blue');
  });

  it('renders dark-blue disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="dark-blue" disabled></sc-tag>`);

    expect(el.type).to.equal('dark-blue');
  });

  it('renders dark-blue link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="dark-blue" mode='link'></sc-tag>`);

    expect(el.type).to.equal('dark-blue');
  });

  it('renders red tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="red"></sc-tag>`);

    expect(el.type).to.equal('red');
  });

  it('renders red filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="red" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('red');
  });

  it('renders red disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="red" disabled></sc-tag>`);

    expect(el.type).to.equal('red');
  });

  it('renders red link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="red" mode='link'></sc-tag>`);

    expect(el.type).to.equal('red');
  });

  it('renders amber tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="amber"></sc-tag>`);

    expect(el.type).to.equal('amber');
  });

  it('renders amber filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="amber" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('amber');
  });

  it('renders amber disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="amber" disabled></sc-tag>`);

    expect(el.type).to.equal('amber');
  });

  it('renders amber link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="amber" mode='link'></sc-tag>`);

    expect(el.type).to.equal('amber');
  });

  it('renders green tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="green"></sc-tag>`);

    expect(el.type).to.equal('green');
  });

  it('renders green filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="green" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('green');
  });

  it('renders green disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="green" disabled></sc-tag>`);

    expect(el.type).to.equal('green');
  });

  it('renders green link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="green" mode='link'></sc-tag>`);

    expect(el.type).to.equal('green');
  });

  it('renders grey tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="grey"></sc-tag>`);

    expect(el.type).to.equal('grey');
  });

  it('renders grey filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="grey" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('grey');
  });

  it('renders grey disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="grey" disabled></sc-tag>`);

    expect(el.type).to.equal('grey');
  });

  it('renders grey link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="grey" mode='link'></sc-tag>`);

    expect(el.type).to.equal('grey');
  });

  it('renders black tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="black"></sc-tag>`);

    expect(el.type).to.equal('black');
  });

  it('renders black filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="black" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('black');
  });

  it('renders black disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="black" disabled></sc-tag>`);

    expect(el.type).to.equal('black');
  });

  it('renders black link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="black" mode='link'></sc-tag>`);

    expect(el.type).to.equal('black');
  });

  it('renders white tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="white"></sc-tag>`);

    expect(el.type).to.equal('white');
  });

  it('renders white filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="white" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('white');
  });

  it('renders white disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="white" disabled></sc-tag>`);

    expect(el.type).to.equal('white');
  });

  it('renders white link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="white" mode='link'></sc-tag>`);

    expect(el.type).to.equal('white');
  });

  it('renders grey-dash tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="grey-dash"></sc-tag>`);

    expect(el.type).to.equal('grey-dash');
  });

  it('renders grey-dash filled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="grey-dash" mode='filled'></sc-tag>`);

    expect(el.type).to.equal('grey-dash');
  });
  it('renders grey-dash disabled tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="grey-dash" disabled></sc-tag>`);

    expect(el.type).to.equal('grey-dash');
  });

  it('renders grey-dash link tag', async () => {
    const el = await fixture<ScTag>(html`<sc-tag type="grey-dash" mode='link'></sc-tag>`);

    expect(el.type).to.equal('grey-dash');
  });
});

import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScEmployeeGroupedAvatar } from '../../../src/components/ScEmployee/ScEmployeeGroupedAvatar.js';
import '../../../elements/sc-employee.js';
import { ScAvatar } from '@scdevkit/webkit/dist/src/components/ScAvatar/ScAvatar.js';

describe('ScEmployeeGroupedAvatar', () => {
  it('renders default employee grouped avatar', async () => {
    const el = await fixture<ScEmployeeGroupedAvatar>(html`
      <sc-employee-grouped-avatar style="display: block; width: 10rem;" .ids=${['1574871', '1431830', '1638918','1574271', '1431835', '1638118','1574771', '1433830', '1638818']}></sc-employee-grouped-avatar>
    `);
    
    const scEmployeeAvatar = el.getScEmployeeAvatarElement();
    await scEmployeeAvatar?.updateComplete;

    const scAvatar = el.getScAvatarElement();
    await scAvatar?.updateComplete;

    expect(el.ids).to.include('1638918');
    expect(el.size).to.equal('lg');
    expect(el.avatarSize).to.equal('3rem');
    
    const elOverflowCount = el.shadowRoot?.querySelector('.avatar-overflow-count');
    expect(elOverflowCount).to.exist;
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    elOverflowCount?.dispatchEvent(clickEvent);
  });

  it('calculates siblingIdsCount and rowIndex correctly', async () => {
    const parentContainer = await fixture(html`
      <div>
        <sc-employee-grouped-avatar ids='["1", "2", "3"]'></sc-employee-grouped-avatar>
        <sc-employee-grouped-avatar ids='["4", "5"]'></sc-employee-grouped-avatar>
        <sc-employee-grouped-avatar ids='["6", "7", "8", "9"]'></sc-employee-grouped-avatar>
      </div>
    `);

    const avatars = Array.from(
      parentContainer.querySelectorAll('sc-employee-grouped-avatar')
    ) as ScEmployeeGroupedAvatar[];

    const currentAvatar = avatars[1];
    const result = currentAvatar.findSiblingGroupedAvatars(currentAvatar);

    expect(result.siblingIdsCount).to.equal(10);
    expect(result.rowIndex).to.equal(1);
  });

  it('calculates avatarSize based on scAvatar dimensions', async () => {
    const el = await fixture<ScEmployeeGroupedAvatar>(html`
      <sc-employee-grouped-avatar style="display: block; width: 10rem;" .ids=${['1', '2', '3']}></sc-employee-grouped-avatar>
    `);

    const scAvatar = {
      getBoundingClientRect: () => ({ width: 48 } as DOMRect),
      avatarSize: '3rem',
    } as unknown as ScAvatar;

    el.getScAvatarElement = () => scAvatar;

    el.updateComplete;
    el.requestUpdate();

    const avatarSizeInRem = el.convertPxToRem(48);
    expect(avatarSizeInRem).to.equal('3rem');
    expect(el.avatarSize).to.equal('3rem');
  });
});
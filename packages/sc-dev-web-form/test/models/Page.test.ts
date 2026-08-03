import { expect } from '@open-wc/testing';
import { Page } from '../../src/models/Page.js';
import { Component } from '../../src/models/Component.js';

const _page: any = {
  id: 'e23df595-b29b-47e6-9ad8-ad5df1755084',
  layout: {
    row: '6fd70a5e-176c-40fc-a350-a478afa7d4c1',
  },
  components: [
    {
      id: 'b1420275-22c9-4900-8221-12f2c42ccbbf',
      layout: {
        row: '86486186-a4cb-4c53-891e-0c3be9552eaa',
      },
      type: 'text-field',
      template: {
        label: 'Text Field',
      },
    },
    {
      id: 'ac63579a-f112-4fe6-b225-a1471c9dae34',
      layout: {
        row: '135ac8cd-a75c-4ab6-95ee-79d1818b6412',
      },
      type: 'number-input',
      template: {
        label: 'Number Input',
      },
    },
  ],
};
describe('Page model', () => {
  it('render the properties', () => {
    const newPage = new Page();
    expect(newPage.id).not.equal(undefined);
  });

  it('page from', () => {
    const newPage = Page.from(_page);
    expect(newPage.components.length).to.equal(_page.components.length);
  });

  it('page addComponent', () => {
    const page = Page.from(_page);
    page.addComponent('box');
    expect(page.components.length).to.equal(_page.components.length + 1);
  });

  it('page insertComponent', () => {
    const page = Page.from(_page);
    const newComponent = new Component('box');
    page.insertComponent(page.components[0].id, newComponent);
    expect(page.components[1].id).to.equal(newComponent.id);
  });

  it('page removeComponent', () => {
    const page = Page.from(_page);
    page.removeComponent(page.components[0].id);
    expect(page.components.length).to.equal(_page.components.length - 1);
  });

  it('page getComponent', () => {
    const page = Page.from(_page);
    const component = page.getComponent(page.components[0].id);
    expect(component?.id).to.equal(page.components[0].id);
  });

  it('page getAllComponents', () => {
    const page = Page.from(_page);
    const components = page.getAllComponents();
    expect(components.length).to.equal(page.components.length);
  });

  it('page getAllComponentsWithParents', () => {
    const _page: any = {
      id: '57d982cd-d008-4d6b-ac46-cd2cd616c20e',
      layout: {
        row: '4fb2294d-d583-4ef3-9785-5e4e64282062',
      },
      components: [
        {
          id: '0267f65f-6e0f-4d07-bc23-9a9df4e3bcde',
          layout: {
            row: '0195e872-bc27-4036-af82-a6421770be16',
          },
          type: 'box',
          template: {
            label: 'Box',
          },
          components: [
            {
              id: 'a0c4ec88-466e-4add-9ace-9dd7e8e77e32',
              layout: {
                row: 'a80716e9-9fed-4a4a-8c57-9fcb2b151ba3',
              },
              type: 'text-field',
              template: {
                label: 'Text Field',
              },
            },
            {
              id: 'd29d54e1-c3d5-487e-8319-a12e2d2bf441',
              layout: {
                row: '5e74cb52-0aaa-4723-80bc-4c1fc0499e91',
              },
              type: 'number-input',
              template: {
                label: 'Number Input',
              },
            },
          ],
        },
      ],
    };
    const page = Page.from(_page);
    const components = page.getAllComponentsWithParents();
    expect(components.length).to.equal(3);
  });

  it('page getAllRowsComponents', () => {
    const _page: any = {
      id: '57d982cd-d008-4d6b-ac46-cd2cd616c20e',
      layout: {
        row: '4fb2294d-d583-4ef3-9785-5e4e64282062',
      },
      components: [
        {
          id: '0267f65f-6e0f-4d07-bc23-9a9df4e3bcde',
          layout: {
            row: '0195e872-bc27-4036-af82-a6421770be16',
          },
          type: 'box',
          template: {
            label: 'Box',
          },
          components: [
            {
              id: 'd29d54e1-c3d5-487e-8319-a12e2d2bf441',
              layout: {
                row: 'a80716e9-9fed-4a4a-8c57-9fcb2b151ba3',
              },
              type: 'number-input',
              template: {
                label: 'Number Input',
              },
            },
            {
              id: 'a0c4ec88-466e-4add-9ace-9dd7e8e77e32',
              layout: {
                row: 'a80716e9-9fed-4a4a-8c57-9fcb2b151ba3',
              },
              type: 'text-field',
              template: {
                label: 'Text Field',
              },
            },
          ],
        },
      ],
    };
    const page = Page.from(_page);
    const rows = page.getAllRowsComponents();
    expect(Object.keys(rows).length).to.equal(1);
  });

  it('page updateComponent', () => {
    const page = Page.from(_page);
    page.updateComponent(page.components[0].id, { type: 'number-input' } as any);
    expect(page.components[0].type).to.equal('number-input');
  });

  it('page getComponentParents', () => {
    const _page: any = {
      id: '57d982cd-d008-4d6b-ac46-cd2cd616c20e',
      layout: {
        row: '4fb2294d-d583-4ef3-9785-5e4e64282062',
      },
      components: [
        {
          id: '0267f65f-6e0f-4d07-bc23-9a9df4e3bcde',
          layout: {
            row: '0195e872-bc27-4036-af82-a6421770be16',
          },
          type: 'box',
          template: {
            label: 'Box',
          },
          components: [
            {
              id: 'a0c4ec88-466e-4add-9ace-9dd7e8e77e32',
              layout: {
                row: 'a80716e9-9fed-4a4a-8c57-9fcb2b151ba3',
              },
              type: 'text-field',
              template: {
                label: 'Text Field',
              },
            },
            {
              id: 'd29d54e1-c3d5-487e-8319-a12e2d2bf441',
              layout: {
                row: '5e74cb52-0aaa-4723-80bc-4c1fc0499e91',
              },
              type: 'number-input',
              template: {
                label: 'Number Input',
              },
            },
          ],
        },
      ],
    };
    const page = Page.from(_page);
    const parentComponents = page.getComponentParents('a0c4ec88-466e-4add-9ace-9dd7e8e77e32');
    expect(parentComponents[0].id).to.equal('0267f65f-6e0f-4d07-bc23-9a9df4e3bcde');
  });
});
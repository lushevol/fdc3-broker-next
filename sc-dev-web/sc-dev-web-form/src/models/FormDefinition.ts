import { v4 } from 'uuid';
import { cloneProperties } from '../shared/utils.js';
import { Page } from './Page.js';
import { Component } from './Component.js';
import { FormBase } from './base/FormBase.js';
import type { CUSTOM_COMPONENT } from '../viewers/types.js';
import { DataSource } from './DataSource.js';
import { Rule } from './Rule.js';
import { CoverPageTemplate, ConfirmationPageTemplate } from './PageDefaultTemplate.js';
import { COVER_PAGE_TYPE, CONFIRMATION_PAGE_TYPE, FORM_PAGE_TYPE } from '../shared/constants.js';

export class FormDefinition extends FormBase {
  pages: Page[] = [];
  version = '1';
  customComponents: CUSTOM_COMPONENT[];
  rules: Rule[];
  dataSources: DataSource[];

  constructor(pages?: Page[], singlePage?: boolean) {
    super();
    if (!this.id) {
      this.id = v4();
    }
    if (!pages || !Array.isArray(pages)) {
      if (!singlePage) {
        this.addPage({}, COVER_PAGE_TYPE);
        this.addPage();
        this.addPage({}, CONFIRMATION_PAGE_TYPE);
      } else {
        this.pages = [new Page()];
      }
      return this;
    }
    this.pages = pages.map((page: Page) => Page.from(page));
  }

  static from(target: FormDefinition, removeRedundantProps?: boolean) {
    const obj = { ...target };
    if (!obj) return new FormDefinition();

    const pages = (obj.pages || []).slice();
    Reflect.deleteProperty(obj, 'pages');

    const newInstance = new FormDefinition(pages);
    cloneProperties(newInstance, obj);
    newInstance.dataSources = (obj.dataSources || []).map((item: DataSource) =>
      DataSource.from(item));

    return newInstance;
  }
  
  static duplicate(formDefinition: FormDefinition, removeRedundantProps?: boolean) {
    const newFormDefinition = FormDefinition.from(
      formDefinition,
      removeRedundantProps
    );

    newFormDefinition.id = v4();

    newFormDefinition.pages = newFormDefinition.pages.map((page: Page) =>
      Page.duplicate(page, removeRedundantProps)
    );

    return newFormDefinition;
  }

  update(data: any) {
    if (!data) return this;
    const _data = JSON.parse(JSON.stringify(data));
    this.pages = [];
    _data.pages.forEach((p: any) => {
      this.pages.push(Page.from(p));
    });
    this.id = data.id;
    this.layout = data.layout;
    this.customComponents = data.customComponents;
    this.rules = data.rules;
    this.dataSources = (data.dataSources || []).map((item: DataSource) => DataSource.from(item));
    return this;
  }

  clear() {
    this.pages = [new Page()];
    this.customComponents = [];
    this.rules = [];
    this.dataSources = [];
    this.id = v4();
    return this;
  }

  updateCustomComponents(components: CUSTOM_COMPONENT[]) {
    this.customComponents = components;
  }

  updateRules(rules: Rule[]) {
    this.rules = rules;
  }

  addEmptyPage(props = {}) {
    const newPage = new Page();
    cloneProperties(newPage, props);

    return newPage;
  }

  initPages() {
    this.addPage({}, COVER_PAGE_TYPE);
    this.addPage({}, FORM_PAGE_TYPE);
    this.addPage({}, CONFIRMATION_PAGE_TYPE);
    return this;
  }

  addPage(props = {}, type?: string) {
    let newPage;
    const count = this.pages.filter((page: Page) => page.type === type)?.length || 0;
    if (type === COVER_PAGE_TYPE) {
      newPage = new Page(CoverPageTemplate.components as Component[], COVER_PAGE_TYPE, count + 1);
    } else if (type === CONFIRMATION_PAGE_TYPE) {
      newPage = new Page(ConfirmationPageTemplate.components  as Component[], CONFIRMATION_PAGE_TYPE, count + 1);
    } else {
      newPage = new Page(undefined, FORM_PAGE_TYPE, count + 1);
    }
    cloneProperties(newPage, props);

    this.pages.push(newPage);

    return newPage;
  }

  removePage(id: string) {
    this.pages = (this.pages
      .map((page: Page) => (page.id === id ? undefined : page))
      .filter(Boolean) as Page[]);
  }

  getPage = (id?: string): Page | undefined  => {
    return this.pages.find((page: Page) => page.id === id);
  };

  getPageIndex = (id?: string): number  => {
    return this.pages.findIndex((page: Page) => page.id === id);
  };

  sortPage = (order: number /* start from 0 */, id: string) => {
    let newOrder = order;
    if (typeof newOrder === 'number') {
      if (newOrder > this.pages.length - 1) {
        newOrder = this.pages.length - 1;
      }
      const orgIndex = this.getPageIndex(id);
      const orgPage = this.pages[orgIndex];
      if (orgPage) {
        if (orgIndex < newOrder) {
          this.pages.splice(newOrder + 1, 0, orgPage);
          this.pages.splice(orgIndex, 1);
        } else {
          this.pages.splice(newOrder, 0, orgPage);
          this.pages.splice(orgIndex + 1, 1);
        }
      }
    }
  };

  updatePage(id: string, page: Page) {
    this.pages = this.pages.map(s => (s.id === id ? page : s));
    return this;
  }

  updateDataSource(data: DataSource[]) {
    this.dataSources = (data || []).map((item: DataSource) =>
      DataSource.from(item));
  }
  
  getDataSources() {
    return this.dataSources;
  }

  getDataSource(id: string) {
    return this.dataSources?.find(dataSource => dataSource.id === id);
  }
  
  deleteDataSource(id: string) {
    const index = this.dataSources?.findIndex(dataSource => dataSource.id === id);
    if (index > -1) {
      this.dataSources.splice(index, 1);
    }
    return this.dataSources;
  }

  getRule(id: string) {
    return this.rules?.find(rule => rule.id === id);
  }

  getRulesForComponent(componentId: string): Rule[] {
    return (this.rules || []).filter(rule => {
      const fields = rule.fields as Record<string, string> | undefined;
      if (!fields) return false;
      return Object.values(fields).includes(componentId);
    });
  }

  deleteRule(id: string) {
    const index = this.rules?.findIndex(rule => rule.id === id);
    if (index > -1) {
      this.rules.splice(index, 1);
    }
    return this.rules;
  }

}

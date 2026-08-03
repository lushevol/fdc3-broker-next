import { html, nothing } from 'lit';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
import { Component } from '../../../../models/Component.js';
import { CarouselOption } from '../../../../models/Components/index.js';
import { state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { generateUniqueId } from '../../../../shared/generateUniqueId.js';

export class CarouselEditor extends ComponentMixin(ContainerBaseEditor) {
    @state() _carousels: CarouselOption[] = [];

    renderLabel: any = () => nothing;
    
    willUpdate() {
        const { carousels } = this.template;
        if (carousels) {
            this._carousels = carousels;
        }
    }

    get template() {
        return this.component.template;
    }

    childComponents(item: CarouselOption) {
        return this.component.components?.filter((c: Component) => c.tabId === item.id);
    }
    
    renderOtherGeneral = () => {
        const { scrollHint, aspectRatio } = this.template;
        return html`
          <div class=row>
            <sc-text-input
              label="ScrollHint"
              value=${scrollHint}
              @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'scrollHint')}
            >
            </sc-text-input>
          </div>
          <div class=row>
            <sc-text-input
              label="AspectRatio"
              value=${aspectRatio}
              @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'aspectRatio')}
            >
            </sc-text-input>
          </div>
          `;
    };

    renderBehavior: any = () => {
        const { pagination, autoplay, loop } = this.component?.template ?? {};
        return html`
          <div>
            <div class=w-half>
              <sc-switch
                label="Pagination"
                ?checked=${pagination}
                @sc-change=${(e: CustomEvent) => {
                    this.onChange(e.detail.checked, 'pagination');
                }}
              >
              </sc-switch>
            </div>
            <div class=w-half>
              <sc-switch
                label="Autoplay"
                ?checked=${autoplay}
                @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'autoplay')}
              >
              </sc-switch>
            </div>
            <div class=w-half>
              <sc-switch
                label="Loop"
                ?checked=${loop}
                @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'loop')}
              >
              </sc-switch>
            </div>
          </div>
        `;
    };
    deleteCarousel(index: number) {
        if (this._carousels.length === 1) return;
        this._carousels.splice(index, 1);
        this.onChange(this._carousels, 'carousels');
        this.requestUpdate();
    }

    addCarousel() {
        const cOption = new CarouselOption();
        const nameId = this._carousels.length ? Number(this._carousels[this._carousels.length - 1]?.name?.split(' ').pop()) + 1 : 1;
        cOption.id = `Carousel${generateUniqueId()}`;
        cOption.name = `Carousel ${nameId}`;
        this._carousels = [...this._carousels, cOption];
        this.onChange(this._carousels, 'carousels');
        this.requestUpdate();
    }
    renderDataOptions: any = () => {
        return html`
          <style>
            .option-title {
              font-size: 0.875rem;
              margin-bottom: var(--sc-spacing-8);
            }
            .options-container {
              overflow-x: hidden;
            }
            .options-text {
              font-size: 0.875rem;
            }
            .options-row {
              margin-bottom: var(--sc-spacing-4);
            }
            .options-row .value-col {
              padding-left: var(--sc-spacing-8);
            }
            .options-remove {
              color: var(--sc-color-red-500);
              margin-top:0.4rem;
              padding-left: var(--sc-spacing-4);
              cursor: pointer;
            }
            .options-remove-disable {
              color: var(--sc-color-grey-500);
              margin-top:0.4rem;
              padding-left: var(--sc-spacing-4);
              cursor: pointer;
            }
            .add-link {
              color: var(--sc-color-blue-500);
              cursor: pointer;
            }
          </style>
          <div>
            <div class=option-title>Options</div>
            <div class="options-container">
            ${
      this._carousels?.map((carousel: CarouselOption, index: number) => {
        return html`
                <sc-grid-row no-gutters class="options-row">
                  <sc-grid-column md="6">
                    <sc-label label=${carousel.name} label-size="md"></sc-label>
                  </sc-grid-column>
                  <sc-grid-column md="5">
                    <sc-icon
                      name="trash--line"
                      class=${ this._carousels.length === 1 ? 'options-remove-disable' : 'options-remove ' }
                      @click=${() => this.deleteCarousel(index)}
                    >
                  </sc-grid-column>
                </sc-grid-row>
                `;
      })
    }
            </div>
            <div @click=${this.addCarousel} class='add-link row'>+ Add carousel</div>
          </div>
        `;
      };
    
    renderBasicComponent = () => {        
        const { scrollHint, aspectRatio, pagination, autoplay, loop } = this.template;
        const key = scrollHint + aspectRatio + pagination + autoplay + loop + this._carousels.length;

        return html`
        ${keyed(key, html`
          <sc-carousel
            scroll-hint=${scrollHint}
            aspect-ratio=${aspectRatio}
            ?pagination=${pagination}
            ?autoplay=${autoplay}
            ?loop=${loop}
            >
                ${
                    this._carousels?.map((item: CarouselOption) => {
                        return html`
                        <sc-carousel-item>
                            <style>
                              .row {
                                padding: 0 0 0.937rem 0;
                                width: 100%;
                                display: block;
                              }
                            </style>
                            <div class="row">
                                ${
                                    this.generateComponent(
                                        this.childComponents(item)
                                    )
                                }
                                ${!this.childComponents(item)?.length ? item.name : ''}
                                ${renderDragDropZone(e => this.onDrop(e, item.id), this.dragDropState?._highlighting)}
                            </div>
                        </sc-carousel-item>
                        `;
                    })
                }
            </sc-carousel>
        `)}
        `;
    };
}
import { html } from 'lit';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { Component } from '../../../../models/Component.js';
import { keyed } from 'lit/directives/keyed.js';

export class Carousel extends ComponentMixin(FormBaseViewer) {
    renderElement() {
        const { carousels,scrollHint, aspectRatio, pagination, autoplay, loop } = this.template;
        const key = scrollHint + aspectRatio + pagination + autoplay + loop + carousels.length;
        
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
                        carousels?.map((item: any) => {
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
                                            this.component.components?.filter((c: Component) => c.tabId === item.id), 
                                            true, 
                                            this.key, 
                                            this.formData, 
                                            this.component, 
                                            this.readonly,
                                        )
                                    }
                                </div>
                            </sc-carousel-item>
                            `;
                        })
                    }
                </sc-carousel>
            `)}
            `;
    }
}
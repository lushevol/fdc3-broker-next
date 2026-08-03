import { html, nothing } from 'lit';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import ScActionBarStyle from './ScActionBar.style.js';
import ScTheme from '../../styles/ScTheme.js';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ScBack } from '../ScBack/ScBack.js';
import { ScButtonDropdown } from '../ScButton/ScButtonDropdown.js';
import { styleMap } from 'lit/directives/style-map.js';
import { SIZE } from '../../shared/util.js';
import { ScButton } from '../ScButton/ScButton.js';
import { ScLabel } from '../ScLabel/ScLabel.js';
import { ScBreadcrumb } from '../ScBreadcrumb/ScBreadcrumb.js';
import { ScBreadcrumbItem } from '../ScBreadcrumb/ScBreadcrumbItem.js';

import { HasSlotController } from '../../shared/slot.js';
import { watch } from '../../shared/watch.js';
import { msg } from '@lit/localize';
import ScElement from '../../shared/sc-element.js';
import { mediaQuery } from '../../shared/mediaQuery.js';

type T_BTN_SIZE = `${SIZE}`;


interface leftBackOption{
    back?: ScBack,
    breadcrumb?: ScBreadcrumb & {
        size: T_BTN_SIZE,
        data: (ScBreadcrumbItem & { name: string})[],
    },
}

interface leftActionOption{
    text?: string,
    button?: ScButton & {
        tooltipText?: string;
        buttonText?: string;
    },
    buttonDropdown?: ScButtonDropdown & {
        'sc-select'?: (e:CustomEvent)=>void;
        'option-width'?: string;
        name?: string;
        iconName?: string;
        [key: string]: any;
    },
}

type rightButtonOption = ScButton & {
    buttonText?: string;
    click?: (e: MouseEvent) => void;
}

interface rightActionOption{
    button?: rightButtonOption
}

export interface actionConfigOptions {
    'left-back'?: leftBackOption,
    'left-actions'?:leftActionOption[]
    'right-helper'?:  ScLabel & {
        [key: string]: any;
    },
    'right-groups'?: rightActionOption[]
}

const defaultConfig = {
    'left-back': {
        back: {
            mode: 'href',
            to: '#',
            label: msg('Back', { id: 'sc-action-bar-default-back-text' }),
            disabled: false,
        },
    },
    'left-actions': [] as leftActionOption,
    'right-helper': {} as ScLabel,
    'right-groups': [] as rightActionOption,
} as actionConfigOptions;
export class ScActionBar extends ScElement {

    static styles = ScTheme.getStyles().concat([ScActionBarStyle]);

    @property({ type: Boolean, attribute: 'hide-back' }) hideBack = false;
    // @property({ type: Boolean, attribute: 'hide-validation' }) hideValidation = true;
    @property({ type: Boolean, attribute: 'hide-left-actions' }) hideLeftActions = false;
    @property({ type: Boolean, attribute: 'hide-right-helper' }) hideRightHelper = false;
    @property({ type: Boolean, attribute: 'hide-right-groups' }) hideRightGroups = false;
    @property({ type: Boolean, attribute: 'hide-bottom-border' }) hideBottomBorder = false;
    @property({ type: Boolean, attribute: 'hide-shadow' }) hideShadow = true;
    @property({ type: Object }) config = defaultConfig;
    @property({ type: Number, attribute: 'z-index' }) zIndex = 400;
    @property({ type: Boolean, attribute: 'no-sticky' }) noSticky = false;
    
    @state() size: T_BTN_SIZE = 'sm';
    @state() _hideBottomBorder = false;
    @state() _hideShadow = true;
    @state() _open = false;

    @query('.right-groups sl-dropdown') rightDropdown: SlDropdown;
    @watch('hideBottomBorder', { waitUntilFirstUpdate: true })
    onHideBottomBorderChange() {
        this._hideBottomBorder = this.hideBottomBorder;
        this._hideShadow = !this.hideBottomBorder;
    }

    @watch('hideShadow', { waitUntilFirstUpdate: true })
    onHideShadowChange() {
        this._hideShadow = this.hideShadow;
        this._hideBottomBorder = !this.hideShadow;
    }

    @mediaQuery(['mobileSm', 'mobileLg', 'tablet', 'desktop'], { waitAfterUpdate: true })
    renderOnMobile() {
        this.requestUpdate();
    }

    static get scopedElements() {
        return {
            'sl-dropdown': SlDropdown,
        };
    }

    protected readonly hasSlotController = new HasSlotController(
        this,
        'left-back',
        'left-actions',
        'left-validation',
        'right-helper',
        'right-groups'
    );

    renderLeftBack() {
        const item = this.config['left-back'] as leftBackOption || null;
        if (!item) {
            return nothing;
        }
        return html`<div class="left-back" style=${this.isMobile ? 'width: max-content' : ''}>
            ${
                item.breadcrumb ? 
                html`<sc-breadcrumb
                    .size=${item?.breadcrumb?.size || this.size}
                    style="--sc-breadcrumb-padding: 0.25rem 0rem"
                    >
                    ${
                        item?.breadcrumb?.data?.map(bcItem=>html`<sc-breadcrumb-item 
                            href=${bcItem?.href as string} 
                            target=${bcItem?.target as string}
                            ...=${({ ...bcItem })} 
                            >${bcItem.name}</sc-breadcrumb-item>`)
                    }
                    </sc-breadcrumb>` : nothing
            }
            ${ 
                item?.back ? 
                html`<sc-back 
                    mode=${item?.back?.mode as 'href'} 
                    label=${this.isMobile ? '' : item?.back?.label as string} 
                    to=${item?.back?.to as string}
                    ?disabled=${item?.back?.disabled}
                    ...=${({ ...item?.back })}
                    ></sc-back>` : nothing
            }
            </div>`;
    }

    renderOptionContent(item: leftActionOption) {
        if (item.text) {
            return html`<div class="action-label">${item.text}</div>`;
        }
        if (item.button) {
            if (item.button.tooltipText && !item?.button?.disabled) {
                return html`
                <sc-tooltip trigger="hover" ?hoist=${true}>
                    <slot slot="content" name="tooltip">${item.button.tooltipText}</slot>
                    <sc-button
                        type=${item.button.type}
                        .size=${item.button.size || this.size}
                        .leftIcon=${item.button.leftIcon}
                        ?disabled=${item?.button?.disabled}
                        width=${item.button.width || 'auto'} 
                    >
                        <slot name="button">${item.button.buttonText}</slot>
                    </sc-button>
                </sc-tooltip>`;
            }
            if (this.isMobile)
                return html`<div data-item=${item.button?.buttonText}>${item.button.buttonText}</div>`;
            return html`<sc-button
                type=${this.isMobile ? 'text' : item.button.type}
                .size=${item.button.size || this.size}
                .leftIcon=${item.button.leftIcon}
                ?disabled=${item?.button?.disabled}
                data-item=${item.button?.buttonText}
                width=${item.button.width || 'auto'} 
                @click=${item?.button?.['click'] ?? (() => {})}
            >
                <slot name="button">${item.button.buttonText}</slot>
            </sc-button>`;
        }
        return false;
    }

    renderLeftActions() {
        const leftActions = this.config?.['left-actions'];
        if (!leftActions || leftActions?.length === 0) {
            return nothing;
        }
        if (this.isMobile) {
            return html`
                <div class="left-actions mobile">
                    <sl-dropdown
                        ?open=${this._open}
                        @click=${async (event: MouseEvent) => {
                            const composedPath = event.composedPath();
                            const closestMenu = composedPath.find((el: any) => el.tagName === 'SC-MENU-ITEM' || el.tagName === 'SC-BUTTON');
                            const dataItem = (closestMenu as Element)?.getAttribute?.('data-item');
                            if (!dataItem) return;
                            this._open = !this._open;
                            await this.updateComplete;
                            this._open = false;
                            const menuItem = leftActions?.find(item => item?.buttonDropdown?.name === dataItem);
                            if (menuItem) {
                                menuItem?.buttonDropdown?.['sc-select']?.({
                                    detail: {
                                        value: (closestMenu as Element)?.getAttribute?.('data-value'),
                                    },
                                } as CustomEvent) ?? (() => {});
                            }
                            const buttonItem = leftActions?.find(item => item.button?.buttonText === dataItem);
                            if (buttonItem) {
                                buttonItem?.button?.['click']?.() ?? (() => {});
                            }
                        }}
                    >
                        <sc-button slot=trigger type="link" size="sm" right-icon="arrow-ios-downward">
                            ${msg('More actions', { id: 'sc-more-actions' })}
                        </sc-button>
                        <sc-menu>
                            ${leftActions.map(item => {
                                const option = this.renderOptionContent(item);
                                if (item.text || item.button && item.button.tooltipText) return nothing;
                                return html`
                                    ${
                                        option ? html`
                                            <sc-menu-item data-item=${item?.text || item.button?.buttonText}>${option}</sc-menu-item>
                                        ` : html`
                                            <sc-menu-item part=menu-item>
                                                ${item?.buttonDropdown?.name}
                                                ${
                                                    item?.buttonDropdown?.data ? html`
                                                        <sc-menu slot=submenu>
                                                            ${
                                                                item?.buttonDropdown?.data.map(data => 
                                                                    html`<sc-menu-item 
                                                                            style='--sc-menu-item-background-hover-color: var(--sc-dropdown-item-background-hover-color, var(--sc-color-blue-lightest))' 
                                                                            value=${data.value}
                                                                            data-item=${item?.buttonDropdown?.name}
                                                                            data-value=${data.value}
                                                                        >
                                                                            ${data.label}
                                                                        </sc-mebu-item>`
                                                                )
                                                            }
                                                        </sc-menu>
                                                    `  : nothing
                                                }
                                            </sc-menu-item>
                                        `
                                    }
                                `;
                            })}
                        </sc-menu>
                    </sl-dropdown>
                </div>
            `;
        }
        return html`<div class="left-actions">
            ${
                leftActions?.map(item=>{
                    const option = this.renderOptionContent(item);
                    if (option) {
                        return option;
                    }
                    return html`<sc-button-dropdown
                    style=${styleMap({
                        width: `${ item?.buttonDropdown?.width || '7.5rem'}`,
                        '--sc-dropdown-min-width': `${ item?.buttonDropdown?.['option-width'] || '12.5rem'}`,
                        '--sc-dropdown-menu-margin-top': '1rem',
                    })}
                    class=${classMap({
                        'left-actions-item-height': true,
                    })}
                    type="link"
                    button-text=${item?.buttonDropdown?.name as string}
                    left-icon=${item?.buttonDropdown?.iconName as string}
                    ?disabled=${item?.buttonDropdown?.disabled}
                    .size=${item?.buttonDropdown?.size || this.size}
                    .value=${item?.buttonDropdown?.value} 
                    .data=${item?.buttonDropdown?.data}
                    @sc-select=${item?.buttonDropdown?.['sc-select'] ?? (() => {})}
                    ...=${({ ...item?.buttonDropdown })}
                    >
                    </sc-button-dropdown>`;
                }) 
            }
        </div>`;
    }

    renderRightHelper() {
        if (this.isMobile || this.isTablet) return;
        const item = this.config?.['right-helper'] as ScLabel || {};
        if (!item.label) {
            return nothing;
        }
        if (item.tooltip) {
            return html`<sc-label 
                label=${item.label as string} 
                tooltip=${item.tooltip as string}
                ?required=${item.required as boolean}
                ...=${({ ...this.config['right-helper'] })}
                style="--sc-label-margin-bottom:0rem;"
            ></sc-label>`;
        }
        return html`<sc-label 
            label=${item.label as string} 
            ?required=${item.required as boolean}
            ...=${({ ...this.config['right-helper'] })}
            style="--sc-label-margin-bottom:0rem;"
        ></sc-label>`;
    }

    runTheButtonClickEvent(event: CustomEvent, buttons: (rightButtonOption | undefined)[] | undefined) {
        if (!buttons) return;
        const value = event.detail.value;
        const callback = buttons.find(btn => btn?.buttonText === value)?.click;
        if (callback) {
            callback();
        }
    }

    renderRightGroups() {
        const rightConfig = this.config?.['right-groups'];
        if (rightConfig?.length === 0) {
            return nothing;
        }
        if (this.isMobile) {
            const buttons: (rightButtonOption | undefined)[] | undefined = rightConfig?.map(conf => conf.button);
            if (buttons && buttons.length > 1) {
                const lastButton = buttons[buttons.length - 1];
                return html`
                    <div class="right-groups">
                        <sl-dropdown hoist>
                            <div slot="trigger" aria-haspopup="true" aria-expanded="true">
                                <sc-icon-button type="secondary" name="more-horizontal" size="sm"></sc-icon-button>
                            </div>
                            <sc-menu>
                                ${
                                    buttons.slice(0, buttons.length - 1).map(config => {
                                        return html`
                                            <sc-menu-item
                                                class='right-group-menu-item'
                                                ?disabled=${config?.disabled}
                                                value=${config?.buttonText}
                                                @click=${(e: MouseEvent) => {
                                                    config?.click(e);
                                                    this.rightDropdown?.hide();
                                                }}
                                            >
                                                ${config?.leftIcon ? html`<sc-icon name=${config?.leftIcon}></sc-icon>` : null} ${config?.buttonText}
                                            </sc-menu-item>
                                        `;
                                    })
                                }
                            </sc-menu>
                            
                        </sl-dropdown>
                        <sc-button
                            .type=${lastButton?.type}
                            .size=${lastButton?.size || this.size}
                            .leftIcon=${lastButton?.leftIcon}
                            ?disabled=${lastButton?.disabled}
                            width=${lastButton?.width || 'auto'} 
                            @click=${lastButton?.['click'] ?? (() => {})}
                        >
                            <slot name="button">${lastButton?.buttonText}</slot>
                        </sc-button>
                    </div>
                `;
            }
        }
        return html`<div class="right-groups">
        ${
            this.config['right-groups']?.map(item=>{
                if (item.button) {
                    return html`
                        <sc-button
                        .type=${item.button.type}
                        .size=${item.button.size || this.size}
                        .leftIcon=${item.button.leftIcon}
                        ?disabled=${item?.button?.disabled}
                        width=${item.button.width || 'auto'} 
                        @click=${item?.button?.['click'] ?? (() => {})}
                        >
                            <slot name="button">${item.button.buttonText}</slot>
                        </sc-button>
                    `;
                }
                return nothing;
            })
        }
        </div>
        `;
    }

    render() {
        return html`<div
        class=${classMap({
            'action-bar-container': true,
            'bottom-border': !this._hideBottomBorder,
            'bottom-shadow': !this._hideShadow,
            'action-bar-container-sticky': !this.noSticky,
        })}
        style=${styleMap({
            zIndex: Number(this.zIndex),
        })}
        >
        <div class="action-bar-left">
            ${
                !this.hideBack ? 
                html`
                ${
                    this.hasSlotController.test('left-back') ? 
                    html`<slot name='left-back'></slot>` :
                    html`${this.renderLeftBack()}`
                }
                ` : nothing
            }
            ${
                this.hideBack || 
                this.hideLeftActions ?
                nothing :
                html`<sc-divider compact="" line-height="xs" style="margin-top: -0.25rem;"></sc-divider>`
            }
            ${
                !this.hideLeftActions ? 
                html`
                <div class="left-actions-container">
                    ${
                        this.hasSlotController.test('left-actions') ? 
                        html`<slot name='left-actions'></slot>` :
                        html`${this.renderLeftActions()}`
                    }
                </div>
                ` : nothing
            }
        </div>
        ${
            !this.hideRightHelper || !this.hideRightGroups ?
            html`
            <div class='action-bar-right'>
                ${
                    !this.hideRightHelper ? 
                    html`<div class='right-helper-container'>
                        ${
                            this.hasSlotController.test('right-helper') ? 
                            html`<slot name='right-helper'></slot>` :
                            html`${this.renderRightHelper()}`
                        }
                </div>` : nothing
                }
                ${
                    !this.hideRightGroups ?
                    html`
                    <div class='right-groups-container'>
                        ${
                            this.hasSlotController.test('right-groups') ?
                            html`<slot name='right-groups'></slot>` :
                            html`${this.renderRightGroups()}`
                        }
                    </div>
                    ` : nothing
                }
            </div>
            ` : nothing
        }
      </div>`;
    }
}

import { TConstructor, safeMixin } from '../../../shared/mixin.js';
import { TableStateMixin } from './table-state-mixin.js';
import ScElement from '../../../shared/sc-element.js';
import { ScTooltip } from '../../ScTooltip/ScTooltip.js';
import { query } from 'lit/decorators.js';
import { ScDataGridOverlapping } from '../ScDataGridOverlapping.js';
import { ToolkitMixin } from './toolkit-mixin.js';
import {
  EPopupComs,
  TInputType,
  TReturnType,
  getIsWraperEqualMasterCell,
  getIsWraperEqualRow,
  getTagName,
  isThisEqualTo,
  matchPopupElement,
} from './overlapping-mixin.tool.js';
import { ScDropdownInput } from '../../ScDropdown/ScDropdownInput.js';
import { ScDropdownMultiSelect } from '../../ScDropdown/ScDropdownMultiSelect.js';
import { ScButtonDropdown } from '../../ScButton/ScButtonDropdown.js';
import { ScSearchField } from '../../ScSearchField/ScSearchField.js';
import { ScTimeInput } from '../../ScTimeInput/ScTimeInput.js';
import { ScDateInput } from '../../ScDatePicker/DateInput/ScDateInput.js';
import { ScDateRangeInput } from '../../ScDatePicker/DateRangeInput/ScDateRangeInput.js';
import { LitElement } from 'lit';
import { findAncestor } from '../../../shared/ancestor.js';
import { getPositionFixedContainer } from '../../../shared/fixed-container.js';
import type SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup.js';

export type TMixin = {
  getRowsViaAttribute(rowId: string): HTMLDivElement[];

  handlePopupRelatedComs: (e: Event) => Promise<void>;
  handleDropdown(
    dropdown: ScDropdownInput,
    overlappingEl: ScDataGridOverlapping
  ): void;
  handleDropdownMulti(
    dropdownMulti: ScDropdownMultiSelect,
    overlappingEl: ScDataGridOverlapping
  ): void;
  handleButtonDropdown(
    buttonDropdown: ScButtonDropdown,
    overlappingEl: ScDataGridOverlapping
  ): void;
  handleDateInput(
    dateInput: ScDateInput,
    overlappingEl: ScDataGridOverlapping
  ): void;
  handleDateRange(
    dateRange: ScDateRangeInput,
    overlappingEl: ScDataGridOverlapping
  ): void;
  handleTimeInput(
    timeInput: ScTimeInput,
    overlappingEl: ScDataGridOverlapping
  ): void;
  handleTooltip(tooltip: ScTooltip, overlappingEl: ScDataGridOverlapping): void;
  handleHoverTooltip(
    tooltip: ScTooltip,
    overlappingEl: ScDataGridOverlapping
  ): void;
  handlePopupRelatedComsForHover: (e: Event) => void;
  preHandleTooltip(
    overlappingEl: ScDataGridOverlapping,
    tooltip?: ScTooltip
  ): void;
  handleSearchField(
    searchField: ScSearchField,
    overlappingEl: ScDataGridOverlapping
  ): void;
  overlappingEl: ScDataGridOverlapping;

  getPopupComponents<T extends TInputType<EPopupComs>>(
    popupComs: T,
    e: Event
  ): TReturnType<T> & {
    parentEl: HTMLElement | undefined;
  };

  /** @deprecated use `hideOverlappingPanel()` instead */
  hideOverlappingPanelWhenScroll(): Promise<void>;
  hideOverlappingPanel(): Promise<void>;
};

export const OverlappingMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends TableStateMixin(ToolkitMixin(superClass)) {
      @query('sc-data-grid-overlapping')
      overlappingEl: ScDataGridOverlapping;

      getRowsViaAttribute(rowId: string) {
        const rows = [
          ...(this.shadowRoot?.querySelectorAll<HTMLDivElement>(
            `[row-id="${rowId}"]`
          ) ?? []),
        ].filter(row => row.tagName.toLowerCase() !== 'sc-data-grid-cell');
        return rows;
      }
      liftedTooltips = new Map<ScTooltip, HTMLElement>();

      getPopupComponents<T extends TInputType<EPopupComs>>(
        popupComs: T,
        e: Event
      ): TReturnType<T> & { parentEl: HTMLElement | undefined } {
        const targets = e.composedPath();
        const popupComponents = {} as TReturnType<T>;
        let parentEl: HTMLElement | undefined;

        for (let i = 0, len = targets.length; i < len; ++i) {
          const target = targets[i];
          for (let i = 0, len = popupComs.length; i < len; ++i) {
            const matchFn = matchPopupElement[popupComs[i]];
            if (!popupComponents[popupComs[i]] && matchFn(target)) {
              popupComponents[popupComs[i]] = target as any;
            }
          }

          if (
            (!parentEl && getIsWraperEqualMasterCell(target)) ||
            getIsWraperEqualRow(target)
          ) {
            parentEl = target as HTMLElement;
            break;
          }
        }
        return {
          ...popupComponents,
          parentEl,
        };
      }

      handlePopupRelatedComsForHover = (e: Event) => {
        e.stopPropagation();
        // @ts-ignore
        this.handlePopupRelatedComs(e.detail.e);
      };

      preHandleTooltip(
        overlappingEl: ScDataGridOverlapping,
        tooltip?: ScTooltip
      ) {
        if (tooltip) {
          if (tooltip.trigger === 'click') {
            this.handleTooltip(tooltip, overlappingEl);
          } else if (tooltip.trigger === 'hover') {
            this.handleHoverTooltip(tooltip, overlappingEl);
          }
        }
      }

      handlePopupRelatedComs = async (e: Event) => {
        const targets = e.composedPath();
        const dataGrids = targets.filter(
          target => getTagName(target) === 'sc-data-grid'
        );
        // @ts-ignore
        if (dataGrids.length > 1 && this !== dataGrids.at(-1)) {
          return;
        }
        const {
          parentEl,
          dropdown,
          dropdownMulti,
          dateInput,
          dateRange,
          tooltip,
          buttonDropdown,
          searchField,
          timeInput,
          employeeInput,
          employeeMultiInput,
        } = this.getPopupComponents(
          [
            EPopupComs.dropdown,
            EPopupComs.dropdownMulti,
            EPopupComs.dateInput,
            EPopupComs.dateRange,
            EPopupComs.tooltip,
            EPopupComs.buttonDropdown,
            EPopupComs.searchField,
            EPopupComs.timeInput,
            EPopupComs.employeeInput,
            EPopupComs.employeeMultiInput,
          ],
          e
        );

        if (!parentEl) {
          return;
        }

        const overlappingEl = this.overlappingEl;
        overlappingEl.hidePopup();

        switch (true) {
          case isThisEqualTo[EPopupComs.timeInput](timeInput):
            if (timeInput) this.handleTimeInput(timeInput, overlappingEl);
            break;
          case isThisEqualTo[EPopupComs.searchField](searchField):
            if (searchField) this.handleSearchField(searchField, overlappingEl);
            break;

          case isThisEqualTo[EPopupComs.tooltip](tooltip):
            this.preHandleTooltip(overlappingEl, tooltip);
            break;
          case isThisEqualTo[EPopupComs.buttonDropdown](buttonDropdown):
            if (buttonDropdown)
              this.handleButtonDropdown(buttonDropdown, overlappingEl);
            break;
          case isThisEqualTo[EPopupComs.dateRange](dateInput, dateRange):
            if (dateRange) this.handleDateRange(dateRange, overlappingEl);
            break;
          case isThisEqualTo[EPopupComs.dateInput](dateInput, dateRange):
            if (dateInput) this.handleDateInput(dateInput, overlappingEl);
            break;

          case isThisEqualTo[EPopupComs.employeeInput](employeeInput):
            if (employeeInput)
              this.handleEmployeeInput(employeeInput, overlappingEl);
            break;
          case isThisEqualTo[EPopupComs.employeeMultiInput](employeeMultiInput):
            if (employeeMultiInput)
              this.handleEmployeeMultiInput(employeeMultiInput, overlappingEl);
            break;

          case isThisEqualTo[EPopupComs.dropdown](dropdown):
            if (dropdown) this.handleDropdown(dropdown, overlappingEl);

            break;
          case isThisEqualTo[EPopupComs.dropdownMulti](dropdownMulti):
            if (dropdownMulti)
              this.handleDropdownMulti(dropdownMulti, overlappingEl);
            break;
        }
      };

      // dropdown
      handleDropdown(
        dropdown: ScDropdownInput,
        overlappingEl: ScDataGridOverlapping
      ) {
        overlappingEl.setLifeCycle({
          beforeShow() {
            dropdown.dropdown.popup.flip = true;
          },
          beforeHide() {
            // aggressive hide all instantly
            dropdown.hide();
            dropdown.dropdown.hide();
            dropdown.dropdown.popup.active = false;
            dropdown.dropdown.popup.flip = false;
          },
        });
        this._applyPopupBoundary(dropdown.dropdown.popup);
        dropdown.dropdown.hoist = false;
        
        overlappingEl.setHostingComponent(dropdown);
        overlappingEl.showPopup();
        dropdown.addEventListener(
          'sc-select',
          e =>
            !!(e as CustomEvent).detail?.value &&
            overlappingEl.hoistingComponent === dropdown &&
            overlappingEl.hidePopup(),
          { once: true }
        );
        dropdown.dropdown?.addEventListener('sl-after-show', 
          () => {
            dropdown.input.input?.focus();
          }, 
          { once: true }
        );
      }
      handleDropdownMulti(
        dropdownMulti: ScDropdownMultiSelect,
        overlappingEl: ScDataGridOverlapping
      ) {
        overlappingEl.setLifeCycle({
          beforeShow() {
            dropdownMulti.dropdown.popup.flip = true;
          },
          beforeHide() {
            // aggressive hide all instantly
            dropdownMulti.hide();
            dropdownMulti.dropdown.hide();
            dropdownMulti.dropdown.popup.active = false;
            dropdownMulti.dropdown.popup.flip = false;
          },
        });
        this._applyPopupBoundary(dropdownMulti.dropdown.popup);
        dropdownMulti.hoist = false;
        overlappingEl.setHostingComponent(dropdownMulti);
        overlappingEl.showPopup();
        dropdownMulti.dropdown?.addEventListener(
          'sl-after-hide',
          () =>
            overlappingEl.hoistingComponent === dropdownMulti &&
            overlappingEl.hidePopup(),
          { once: true }
        );
      }
      handleButtonDropdown(
        buttonDropdown: ScButtonDropdown,
        overlappingEl: ScDataGridOverlapping
      ) {
        overlappingEl.setLifeCycle({
          beforeShow() {
            buttonDropdown.dropdown.dropdown.popup.flip = true;
          },
          beforeHide() {
            // aggressive hide all instantly
            buttonDropdown.dropdown.hide();
            buttonDropdown.dropdown.dropdown.hide();
            buttonDropdown.dropdown.dropdown.popup.active = false;
            buttonDropdown.dropdown.dropdown.popup.flip = false;
          },
        });
        this._applyPopupBoundary(buttonDropdown.dropdown.dropdown.popup);
        buttonDropdown.dropdown.hoist = false;
        overlappingEl.setHostingComponent(buttonDropdown);
        overlappingEl.showPopup();
        buttonDropdown.addEventListener(
          'sc-select',
          () =>
            overlappingEl.hoistingComponent === buttonDropdown &&
            overlappingEl.hidePopup(),
          { once: true }
        );
      }
      // date
      handleDateInput(
        dateInput: ScDateInput,
        overlappingEl: ScDataGridOverlapping
      ) {
        overlappingEl.setHostingComponent(dateInput);
        overlappingEl.showPopup();
        dateInput.addEventListener(
          'sc-close',
          () => overlappingEl.hidePopup(),
          { once: true }
        );
      }
      handleDateRange(
        dateRange: ScDateRangeInput,
        overlappingEl: ScDataGridOverlapping
      ) {
        overlappingEl.setHostingComponent(dateRange);
        overlappingEl.showPopup();
        const inputs = dateRange.shadowRoot
            ?.querySelectorAll('sc-date-input') ?? [];
        inputs.forEach(el =>
          el.addEventListener('sc-close', () => overlappingEl.hidePopup(), {
            once: true,
          })
        );
      }
      handleTimeInput(
        timeInput: ScTimeInput,
        overlappingEl: ScDataGridOverlapping
      ) {
        const dropdown = timeInput.dropdown;
        overlappingEl.setLifeCycle({
          beforeShow() {
            dropdown && (dropdown.popup.flip = true);
          },
          beforeHide() {
            if (dropdown) {
              // aggressive hide all instantly
              dropdown.hide();
              dropdown.popup.active = false;
              dropdown.popup.flip = false;
            }
          },
        });
        if (dropdown) {
          dropdown.hoist = false;
          this._applyPopupBoundary(dropdown.popup);
        }
        overlappingEl.setHostingComponent(timeInput);
        overlappingEl.showPopup();
        dropdown?.addEventListener(
          'sl-after-hide',
          () =>
            overlappingEl.hoistingComponent === timeInput &&
            overlappingEl.hidePopup(),
          { once: true }
        );
      }
      // tooltip
      handleTooltip(tooltip: ScTooltip, overlappingEl: ScDataGridOverlapping) {
        const wrap = this._wrapClipper(tooltip);

        overlappingEl.setLifeCycle({
          beforeShow() {
            tooltip.tooltip.popup.flip = false;
          },
          beforeHide: () => {
            if (tooltip.tooltip.open)
              tooltip.tooltip.hide();
            tooltip.tooltip.popup.flip = false;
          },
          afterHide: () => {
            if (tooltip.open) {
              tooltip.tooltip.popup.popup.style.display = 'none';
              setTimeout(()=> {
                tooltip.tooltip.popup.popup.getAnimations().forEach(a => a.finish());
              },0);
            }
            tooltip.hide();
            this._unwrapClipper(wrap);
          },
        });
        overlappingEl.setHostingComponent(tooltip);
        overlappingEl.showPopup();
        
        tooltip.tooltip.addEventListener(
          'sl-after-hide',
          () => {
            tooltip === overlappingEl.hoistingComponent &&
              overlappingEl.hidePopup();
            tooltip.tooltip.popup.popup.style.removeProperty('display');
          },
          { once: true }
        );
      }
      async handleHoverTooltip(
        tooltip: ScTooltip,
        overlappingEl: ScDataGridOverlapping
      ) {
        const wrap = this._wrapClipper(tooltip);

        overlappingEl.hidePopup();
        tooltip.trigger = 'manual';
        overlappingEl.setLifeCycle({
          beforeShow() {
            tooltip.tooltip.popup.flip = false;
          },
          afterShow: () => {
            tooltip.trigger = 'hover';
          },
          beforeHide() {
            if (tooltip.open)
              tooltip.hide();
            tooltip.tooltip.popup.flip = false;
          },
          afterHide: () => {
            this._unwrapClipper(wrap);
          },
        });
        overlappingEl.setHostingComponent(tooltip);
        overlappingEl.showPopup();
      }

      private _getClipParent(el:HTMLElement) {
        return (
          (() => {
            return findAncestor(el, parent => {
              if (parent === this || parent.tagName === 'BODY')
                return true;
              const style = getComputedStyle(parent);
              if (style.overflow.includes('hidden'))
                return true;
              return false;
            });
          })() ?? this
        );
      }
      private _wrapClipper(el: HTMLElement) {
        const children = Array.from(el.children).filter(c =>
          c.matches(':not([slot="content"])')
        );
        const cell = this._getClipParent(el);
        const wrap = document.createElement('div');
        wrap.className = '-tmp-clipper';
        
        const bounds = cell.getBoundingClientRect();
        const rect = el.getBoundingClientRect(),
          r = ((Math.max(rect.right - bounds.right, 0) * 10000) >> 0) / 10000,
          b = ((Math.max(rect.bottom - bounds.bottom, 0) * 10000) >> 0) / 10000;
        wrap.style.maxWidth = `${rect.width - r}px`;
        wrap.style.maxHeight = `${rect.height - b}px`;
        wrap.style.overflow = 'hidden';
        wrap.style.display = 'flex';
        wrap.style.setProperty('text-wrap-mode', 'nowrap');
        el.append(wrap);
        wrap.append(...children);
        Array.from(el.querySelectorAll('*')).forEach(
          c => 'hoist' in c && (c.hoist = true)
        );
        return wrap;
      }
      private _unwrapClipper(wrap: HTMLElement) {
        wrap.parentElement?.append(...wrap.children);
        wrap.remove();
      }

      private _applyPopupBoundary(popup: SlPopup) {
        const el = (findAncestor(this, parent => {
          if (
            parent === this ||
            parent.tagName === 'BODY' ||
            parent.matches(
              ['sc-column-layout', 'sc-landing-layout', 'sc-search-layout']
                .map(tag => `${tag}:not([type="component"])`)
                .join(', ')
            )
          )
            return true;
          const style = getComputedStyle(parent);
          return !!getPositionFixedContainer.props.find(prop => style[prop] !== 'none');
        }) ?? this.offsetParent ?? document.body) as HTMLElement;
        let boundary: Element | null = el ? el.offsetParent : el;
        let top = el.offsetTop || 0;
        const bottom = Math.max(0, window.innerHeight - top - (el.offsetHeight || 0)) + 10;
        if (boundary?.tagName === 'BODY') boundary = null;
        if (el.tagName === 'SC-COLUMN-LAYOUT')
          top += el.shadowRoot?.querySelector('.header-bar')?.clientHeight || 0;
        top += 10;
        
        if (boundary) popup.autoSizeBoundary = boundary;
        // @ts-ignore // sl is number, but internal floating-ui allows keyed
        popup.autoSizePadding = { top, bottom };
      }


      // search field
      handleSearchField(
        searchField: ScSearchField,
        overlappingEl: ScDataGridOverlapping
      ) {
        const dropdown = searchField.dropdown;
        if (dropdown) {
          dropdown.hoist = false;
          this._applyPopupBoundary(dropdown.popup);
        }
        overlappingEl.setHostingComponent(searchField);
        overlappingEl.showPopup();

        dropdown &&
          dropdown.addEventListener(
            'sl-after-show',
            () => {
              searchField.textInput.shadowRoot?.querySelector('input')?.focus();
            },
            { once: true }
          );
      }

      handleEmployeeInput(input: LitElement, overlappingEl: ScDataGridOverlapping) {
        const dropdown = input.shadowRoot?.querySelector<ScDropdownInput>('sc-dropdown-input');
        if (dropdown) {
          overlappingEl.setLifeCycle({
            beforeShow() {
              dropdown.dropdown.popup.flip = true;
            },
            beforeHide() {
              dropdown.hide();
              dropdown.dropdown.hide();
              dropdown.dropdown.popup.active = false;
              dropdown.dropdown.popup.flip = false;
            },
          });
          dropdown.dropdown.hoist = false;
          dropdown.addEventListener(
            'sc-select',
            () => overlappingEl.hidePopup(),
            { once: true }
          );
          this._applyPopupBoundary(dropdown.dropdown.popup);
        }
        overlappingEl.setHostingComponent(input);
        overlappingEl.showPopup();
      }
      handleEmployeeMultiInput(input: LitElement, overlappingEl: ScDataGridOverlapping) {
        const dropdown = input.shadowRoot?.querySelector<ScDropdownMultiSelect>('sc-dropdown-multi-select');
        if (dropdown) {
          overlappingEl.setLifeCycle({
            beforeShow() {
              dropdown.dropdown.popup.flip = true;
            },
            beforeHide() {
              dropdown.hide();
              dropdown.dropdown.hide();
              dropdown.dropdown.popup.active = false;
              dropdown.dropdown.popup.flip = false;
              if ('value' in input)
                input.value = dropdown.selectedItems;
            },
          });
          dropdown.hoist = false;
          dropdown.shadowRoot
            ?.querySelector('sl-dropdown')
            ?.addEventListener(
              'sl-after-hide',
              () => overlappingEl.hidePopup(),
              {
                once: true,
              }
            );
          this._applyPopupBoundary(dropdown.dropdown.popup);
        }
        overlappingEl.setHostingComponent(input);
        overlappingEl.showPopup();
      }

      connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('click', this.handlePopupRelatedComs, {
          capture: true,
        });

        this.addEventListener('sc-show', this.handlePopupRelatedComsForHover);
      }
      disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener('click', this.handlePopupRelatedComs, {
          capture: true,
        });

        this.removeEventListener(
          'sc-show',
          this.handlePopupRelatedComsForHover
        );
      }

      async hideOverlappingPanel() {
        this.overlappingEl?.hidePopup();
      }
      /** @deprecated use `hideOverlappingPanel()` instead */
      hideOverlappingPanelWhenScroll = this.hideOverlappingPanel;
    }
    return Mixin;
  }
);

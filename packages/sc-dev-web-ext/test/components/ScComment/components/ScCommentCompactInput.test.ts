import { html } from 'lit';
import { fixture, expect, aTimeout } from '@open-wc/testing';
import { ScCommentCompactInput } from '../../../../src/components/ScComment/components/ScCommentCompactInput/ScCommentCompactInput.js';
import '../../../../elements/sc-comment-compact-input.js';
import { aT } from '@fullcalendar/core/internal-common.js';

describe('ScCommentCompactInput', () => {

  describe('addInputListener', () => {
    it('invokes callback("outside") when mousedown fires outside the shadow element', async () => {
      const el = await fixture<ScCommentCompactInput>(html`
        <sc-comment-compact-input
          .value=${'hello'}
          .primaryLabel=${'Post'}
        ></sc-comment-compact-input>
      `);
      await el.updateComplete;

      let callbackArg: string | undefined;
      el.addInputListener(type => { callbackArg = type; });

      document.body.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, composed: true })
      );
      await aTimeout(50);
      expect(callbackArg).to.equal('outside');
    });

    it('invokes callback("inside") when mousedown fires on the .compact-input element', async () => {
      const el = await fixture<ScCommentCompactInput>(html`
        <sc-comment-compact-input
          .value=${'hello'}
          .primaryLabel=${'Post'}
        ></sc-comment-compact-input>
      `);
      await el.updateComplete;

      let callbackArg: string | undefined;
      el.addInputListener(type => { callbackArg = type; });

      const inputRoot = el.shadowRoot!.querySelector('.compact-input') as HTMLElement;
      inputRoot.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, composed: true })
      );
      await aTimeout(50);
      expect(callbackArg).to.equal('inside');
    });

    it('calling addInputListener twice does not register duplicate listeners', async () => {
      const el = await fixture<ScCommentCompactInput>(html`
        <sc-comment-compact-input .value=${'hello'}></sc-comment-compact-input>
      `);
      await el.updateComplete;

      let callCount = 0;
      el.addInputListener(() => { callCount++; });
      el.addInputListener(() => { callCount++; }); // second call should replace the first

      document.body.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, composed: true })
      );
      await aTimeout(50);

      // Only the second registered callback fires once (first was removed by removeInputListener inside addInputListener)
      expect(callCount).to.equal(1);
    });
  });

  describe('removeInputListener', () => {
    it('stops callbacks from firing after remove', async () => {
      const el = await fixture<ScCommentCompactInput>(html`
        <sc-comment-compact-input .value=${'hello'}></sc-comment-compact-input>
      `);
      await el.updateComplete;

      let callCount = 0;
      el.addInputListener(() => { callCount++; });
      el.removeInputListener();

      document.body.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, composed: true })
      );

      expect(callCount).to.equal(0);
    });

    it('is safe to call removeInputListener when no listener is registered', async () => {
      const el = await fixture<ScCommentCompactInput>(html`
        <sc-comment-compact-input .value=${''}></sc-comment-compact-input>
      `);
      await el.updateComplete;
      // Should not throw
      expect(() => el.removeInputListener()).not.to.throw();
    });
  });

  describe('updateCompactReplyMode', () => {
    it('emits sc-cancel when compactReplyMode=true and click occurs outside', async () => {
      const el = await fixture<ScCommentCompactInput>(html`
        <sc-comment-compact-input
          .value=${'hello'}
          .compactReplyMode=${true}
        ></sc-comment-compact-input>
      `);
      await el.updateComplete;

      let cancelFired = false;
      el.addEventListener('sc-cancel', () => { cancelFired = true; });

      document.body.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, composed: true })
      );
      await aTimeout(50);
      expect(cancelFired).to.be.true;
    });

    it('does NOT emit sc-cancel when compactReplyMode=true and click occurs inside', async () => {
      const el = await fixture<ScCommentCompactInput>(html`
        <sc-comment-compact-input
          .value=${'hello'}
          .compactReplyMode=${true}
        ></sc-comment-compact-input>
      `);
      await el.updateComplete;

      let cancelFired = false;
      el.addEventListener('sc-cancel', () => { cancelFired = true; });

      const inputRoot = el.shadowRoot!.querySelector('.compact-input') as HTMLElement;
      inputRoot.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, composed: true })
      );

      expect(cancelFired).to.be.false;
    });

    it('removes the listener when compactReplyMode changes to false', async () => {
      const el = await fixture<ScCommentCompactInput>(html`
        <sc-comment-compact-input
          .value=${'hello'}
          .compactReplyMode=${true}
        ></sc-comment-compact-input>
      `);
      await el.updateComplete;

      el.compactReplyMode = false;
      await el.updateComplete;

      let cancelFired = false;
      el.addEventListener('sc-cancel', () => { cancelFired = true; });

      document.body.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, composed: true })
      );

      expect(cancelFired).to.be.false;
    });
  });

  describe('handleSubmit', () => {
    describe('when allowAPI is false (default)', () => {
      it('emits sc-submit with value and mentions', async () => {
        const el = await fixture<ScCommentCompactInput>(html`
          <sc-comment-compact-input .value=${'hello'}></sc-comment-compact-input>
        `);
        await el.updateComplete;

        let submitDetail: any;
        el.addEventListener('sc-submit', (e: Event) => { submitDetail = (e as CustomEvent).detail; });

        await el.handleSubmit();

        expect(submitDetail).to.exist;
        expect(submitDetail.value).to.equal('hello');
        expect(submitDetail.mentions).to.be.an('array');
      });

      it('does not emit sc-submit when value is empty', async () => {
        const el = await fixture<ScCommentCompactInput>(html`
          <sc-comment-compact-input .value=${''}></sc-comment-compact-input>
        `);
        await el.updateComplete;

        let submitFired = false;
        el.addEventListener('sc-submit', () => { submitFired = true; });

        await el.handleSubmit();

        expect(submitFired).to.be.false;
      });

      it('does not emit sc-submit when value is whitespace only', async () => {
        const el = await fixture<ScCommentCompactInput>(html`
          <sc-comment-compact-input .value=${'   '}></sc-comment-compact-input>
        `);
        await el.updateComplete;

        let submitFired = false;
        el.addEventListener('sc-submit', () => { submitFired = true; });

        await el.handleSubmit();

        expect(submitFired).to.be.false;
      });
    });

    describe('when allowAPI is true', () => {
      it('emits sc-submit-error immediately when referenceId is empty', async () => {
        const el = await fixture<ScCommentCompactInput>(html`
          <sc-comment-compact-input
            .value=${'hello'}
            .allowAPI=${true}
            .referenceId=${''}
          ></sc-comment-compact-input>
        `);
        await el.updateComplete;

        let errorDetail: any;
        el.addEventListener('sc-submit-error', (e: Event) => { errorDetail = (e as CustomEvent).detail; });

        await el.handleSubmit();

        expect(errorDetail).to.exist;
        expect(errorDetail.error.message).to.include('reference-id is required');
      });

      it('calls the API and emits sc-submit-success on success', async () => {
        const mockComment = { id: 'comment-1', content: 'hello' };
        const el = await fixture<ScCommentCompactInput>(html`
          <sc-comment-compact-input
            .value=${'hello'}
            .allowAPI=${true}
            .referenceId=${'case-123'}
            .parentId=${'comment-456'}
          ></sc-comment-compact-input>
        `);
        await el.updateComplete;

        (el as any)._graphQLClient = {
          query: () => Promise.resolve({
            json: () => Promise.resolve({
              data: { _55313_128_webkit_exp_api: { post_createComment: mockComment } },
            }),
          }),
        };

        let successDetail: any;
        el.addEventListener('sc-submit-success', (e: Event) => { successDetail = (e as CustomEvent).detail; });

        await el.handleSubmit();

        expect(successDetail).to.exist;
        expect(successDetail.comment).to.deep.equal(mockComment);
      });

      it('emits sc-submit-error and restores value when API fails', async () => {
        const el = await fixture<ScCommentCompactInput>(html`
          <sc-comment-compact-input
            .value=${'hello'}
            .allowAPI=${true}
            .referenceId=${'case-123'}
          ></sc-comment-compact-input>
        `);
        await el.updateComplete;

        (el as any)._graphQLClient = {
          query: () => Promise.resolve({
            json: () => Promise.resolve({
              errors: [{ message: 'Server error' }],
            }),
          }),
        };

        let errorDetail: any;
        el.addEventListener('sc-submit-error', (e: Event) => { errorDetail = (e as CustomEvent).detail; });

        await el.handleSubmit();

        expect(errorDetail).to.exist;
        expect(errorDetail.error).to.be.instanceOf(Error);

        // Value is restored — a retry attempt should reach the API again
        const mockComment = { id: 'comment-2' };
        (el as any)._graphQLClient = {
          query: () => Promise.resolve({
            json: () => Promise.resolve({
              data: { _55313_128_webkit_exp_api: { post_createComment: mockComment } },
            }),
          }),
        };
        let successFired = false;
        el.addEventListener('sc-submit-success', () => { successFired = true; });

        await el.handleSubmit();

        expect(successFired).to.be.true;
      });

      it('does not call the API a second time before the first resolves', async () => {
        let callCount = 0;
        let resolveQuery!: (v: any) => void;
        const pending = new Promise(resolve => { resolveQuery = resolve; });

        const el = await fixture<ScCommentCompactInput>(html`
          <sc-comment-compact-input
            .value=${'hello'}
            .allowAPI=${true}
            .referenceId=${'case-123'}
          ></sc-comment-compact-input>
        `);
        await el.updateComplete;

        (el as any)._graphQLClient = {
          query: () => {
            callCount++;
            return pending.then(() => ({
              json: () => Promise.resolve({
                data: { _55313_128_webkit_exp_api: { post_createComment: {} } },
              }),
            }));
          },
        };

        const first = el.handleSubmit();
        const second = el.handleSubmit(); // blocked by _submitting or empty currentValue
        resolveQuery(undefined);
        await Promise.all([first, second]);

        expect(callCount).to.equal(1);
      });
    });
  });
});
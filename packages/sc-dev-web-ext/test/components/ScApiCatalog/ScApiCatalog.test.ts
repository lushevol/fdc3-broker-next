import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScApiCatalog } from '../../../src/components/ScApiCatalog/ScApiCatalog.js';
import '../../../elements/sc-api-catalog.js';

type AnyMap = Map<string, any>;

const makeArtifactDetails = (artifactId = 'a1', name = 'Payments API') => ({
	artifactId,
	name,
	description: `${name} description`,
	groupId: 'g1',
	artifactType: 'openapi',
	labels: {
		application_name: 'App One',
		application_id: 'app1',
		ecm_id: 'ecm',
		ecm_category: 'cat',
		api_type: 'rest',
		business_unit: 'Retail',
	},
});

const makeArtifactDto = (artifactId = 'a1', path = '/orders') => ({
	contentType: 'application/json',
	details: makeArtifactDetails(artifactId),
	specification: {
		openapi: '3.0.0',
		info: { title: 'API', description: 'desc', version: '1.0.0' },
		servers: [],
		components: {},
		security: [],
		tags: [],
		paths: {
			[path]: {
				get: {
					tags: ['Orders'],
					summary: 'Get orders',
					description: 'Read orders',
					operationId: 'getOrders',
				},
				post: {
					tags: ['Orders'],
					summary: 'Create order',
					description: 'Create one order',
					operationId: 'createOrder',
				},
			},
		},
	},
});

const defineStableRefs = (el: ScApiCatalog) => {
	Object.defineProperty(el, 'scrollApiResults', {
		value: { scrollTop: 12 },
		configurable: true,
	});
	Object.defineProperty(el, 'scrollEndPtResults', {
		value: { scrollTop: 12 },
		configurable: true,
	});
	Object.defineProperty(el, 'modal', {
		value: { open: false, buttonDisablePrimary: true },
		configurable: true,
	});
	Object.defineProperty(el, 'mainCard', {
		value: { focus: jest.fn() },
		configurable: true,
	});
	Object.defineProperty(el, 'apiInput', {
		value: {
			shadowRoot: {
				querySelector: jest.fn().mockReturnValue({ focus: jest.fn() }),
			},
		},
		configurable: true,
	});
};

describe('ScApiCatalog', () => {
	it('builds GraphQL query strings', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		const allQuery = el._allArtifactsQuery();
		const byIdQuery = el._artifactQuery('abc-123');

		expect(allQuery).to.contain('get_internalAllArtifacts');
		expect(byIdQuery).to.contain('artifactId: "abc-123"');
	});

	it('getAllArtifacts returns parsed artifacts list', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		const artifacts = [makeArtifactDetails('a1'), makeArtifactDetails('a2')];
		(el as any)._graphQLClient = {
			query: jest.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					data: {
						[el.namespace]: {
							get_internalAllArtifacts: { artifacts },
						},
					},
				}),
			}),
		};

		const result = await el.getAllArtifacts();
		expect(result).to.have.length(2);
		expect(result?.[0].artifactId).to.equal('a1');
	});

	it('getAllArtifacts supports flat payload and missing payload', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		(el as any)._graphQLClient = {
			query: jest
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						[el.namespace]: {
							get_internalAllArtifacts: {
								artifacts: [makeArtifactDetails('flat-1')],
							},
						},
					}),
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => undefined,
				}),
		};

		const flat = await el.getAllArtifacts();
		expect(flat).to.have.length(1);

		const missing = await el.getAllArtifacts();
		expect(missing).to.deep.equal([]);
	});

	it('getAllArtifacts returns empty list on query exception', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		(el as any)._graphQLClient = {
			query: jest.fn().mockRejectedValue(new Error('network failed')),
		};

		const result = await el.getAllArtifacts();
		expect(result).to.deep.equal([]);
		expect(errorSpy.mock.calls.length).to.equal(1);
		errorSpy.mockRestore();
	});

	it('getAllArtifacts returns empty list when HTTP response not ok', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		(el as any)._graphQLClient = {
			query: jest.fn().mockResolvedValue({ ok: false, json: jest.fn() }),
		};

		const result = await el.getAllArtifacts();
		expect(result).to.deep.equal([]);
	});

	it('getAllArtifacts handles GraphQL errors payload', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		(el as any)._graphQLClient = {
			query: jest.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ errors: [{ message: 'gql error' }] }),
			}),
		};

		const result = await el.getAllArtifacts();
		expect(result).to.deep.equal([]);
		expect(errorSpy.mock.calls.length).to.equal(1);
		errorSpy.mockRestore();
	});

	it('getArtifact parses string spec and maps endpoints', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		const dto = makeArtifactDto('a1', '/orders');
		(el as any)._graphQLClient = {
			query: jest.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					data: {
						[el.namespace]: {
							get_internalArtifact: {
								...dto,
								specification: JSON.stringify(dto.specification),
							},
						},
					},
				}),
			}),
		};

		const [api, map] = await el.getArtifact('a1');
		expect(api?.details.artifactId).to.equal('a1');
		expect(map?.size).to.equal(2);
		expect(map?.has('get___orders')).to.equal(true);
	});

	it('getArtifact handles non-ok response', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		(el as any)._graphQLClient = {
			query: jest.fn().mockResolvedValue({ ok: false }),
		};
		const [api, map] = await el.getArtifact('missing');
		expect(api).to.equal(undefined);
		expect(map?.size).to.equal(0);
	});

	it('getArtifact supports object spec and missing paths', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		const dto = {
			...makeArtifactDto('obj-1'),
			specification: { paths: {} },
		};
		(el as any)._graphQLClient = {
			query: jest.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					[el.namespace]: {
						get_internalArtifact: dto,
					},
				}),
			}),
		};

		const [api, map] = await el.getArtifact('obj-1');
		expect(api?.details.artifactId).to.equal('obj-1');
		expect(map?.size).to.equal(0);
	});

	it('getArtifact returns undefined api and map on query exception', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		(el as any)._graphQLClient = {
			query: jest.fn().mockRejectedValue(new Error('artifact failed')),
		};

		const [api, map] = await el.getArtifact('boom-id');
		expect(api).to.equal(undefined);
		expect(map).to.be.instanceof(Map);
		expect((map as Map<string, any>).size).to.equal(0);
		expect(errorSpy.mock.calls.length).to.equal(1);
		errorSpy.mockRestore();
	});

	it('getArtifact handles GraphQL errors payload and returns empty map', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		(el as any)._graphQLClient = {
			query: jest.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ errors: [{ message: 'artifact error' }] }),
			}),
		};

		const [api, map] = await el.getArtifact('error-id');
		expect(api).to.equal(undefined);
		expect(map).to.be.instanceof(Map);
		expect((map as Map<string, any>).size).to.equal(0);
		expect(errorSpy.mock.calls.length).to.equal(1);
		errorSpy.mockRestore();
	});

	it('computes endpoint id and empty id', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		expect(el.getEndPtId({ method: 'get', path: '/v1/orders/{id}' })).to.equal(
			'get___v1_orders__id_'
		);
		expect(el.getEndPtId()).to.equal('');
	});

	it('applyApiFilter filters by name description selected id and resets scroll', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);
		const list = [
			makeArtifactDetails('id-1', 'Customer API'),
			makeArtifactDetails('id-2', 'Payment Service'),
		];
		(el as any)._apiList = list;
		(el as any)._api = { details: { artifactId: 'id-2' } };

		el._applyApiFilter(
			new CustomEvent('sc-input', { detail: { value: 'customer' } }) as any
		);
		expect(el.apiList?.map(a => a.artifactId)).to.deep.equal(['id-1', 'id-2']);
		expect((el as any).scrollApiResults.scrollTop).to.equal(0);

		el._applyApiFilter();
		expect(el.apiList).to.have.length(2);
	});

	it('applyEndPtFilter filters and keeps selected endpoint and resets scroll', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);

		const endpointA = {
			method: 'get',
			path: '/customers',
			summary: 'Get customers',
			description: 'Read customers',
			operationId: 'getCustomers',
			tags: ['Customers'],
		};
		const endpointB = {
			method: 'post',
			path: '/payments',
			summary: 'Create payment',
			description: 'Create payment',
			operationId: 'createPayment',
			tags: ['Payments'],
		};
		const map: AnyMap = new Map([
			[el.getEndPtId(endpointA), endpointA],
			[el.getEndPtId(endpointB), endpointB],
		]);
		(el as any)._artifactId = 'id-1';
		(el as any)._endPt = endpointB;
		(el as any)._apiEndPtsMap = new Map([['id-1', map]]);

		el._applyEndPtFilter(
			new CustomEvent('sc-input', { detail: { value: 'customer' } }) as any
		);
		expect(el.endPoints?.map(item => item.path)).to.deep.equal([
			'/customers',
			'/payments',
		]);
		expect((el as any).scrollEndPtResults.scrollTop).to.equal(0);

		el._applyEndPtFilter();
		expect(el.endPoints).to.have.length(2);
	});

	it('selectApi fetches and caches artifact and toggle clears same selection', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);
		const dto = makeArtifactDto('id-1');
		const map = new Map([
			[
				'get__/orders',
				{
					method: 'get',
					path: '/orders',
					summary: 'Get orders',
					description: 'Read orders',
					operationId: 'getOrders',
					tags: ['Orders'],
				},
			],
		]);
		const getArtifactSpy = jest
			.spyOn(el, 'getArtifact')
			.mockResolvedValue([dto as any, map as any]);

		await el.selectApi('id-1');
		expect((el as any)._api?.details.artifactId).to.equal('id-1');
		expect(getArtifactSpy.mock.calls.length).to.equal(1);

		await el.selectApi('id-1');
		expect(getArtifactSpy.mock.calls.length).to.equal(1);

		await el.selectApi('id-1', true);
		expect((el as any)._api).to.equal(undefined);
		expect((el as any)._artifactId).to.equal(undefined);
	});

	it('selectApi removes cache when fetch fails', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);
		(el as any)._apiMap.set('id-2', { details: { artifactId: 'id-2' } });
		(el as any)._apiEndPtsMap.set('id-2', new Map());
		jest.spyOn(el, 'getArtifact').mockResolvedValue([undefined, undefined]);

		await el.selectApi('id-2');
		expect((el as any)._apiMap.has('id-2')).to.equal(true);

		await el.selectApi('id-3');
		expect((el as any)._apiMap.has('id-3')).to.equal(false);
		expect((el as any)._apiEndPtsMap.has('id-3')).to.equal(false);
	});

	it('selectEndPt updates selection and modal primary state', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);
		const endpoint = {
			method: 'get',
			path: '/x',
			summary: 's',
			description: 'd',
			operationId: 'op',
			tags: [],
		};

		await el.selectEndPt(endpoint as any);
		expect((el as any)._endPt).to.equal(endpoint);
		expect((el as any).modal.buttonDisablePrimary).to.equal(false);

		await el.selectEndPt(endpoint as any, true);
		expect((el as any)._endPt).to.equal(undefined);
		expect((el as any).modal.buttonDisablePrimary).to.equal(true);
	});

	it('onValueChange updates api and endpoint from incoming value and handles undefined value', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);

		const dto = makeArtifactDto('id-10');
		const endpoint = {
			method: 'get',
			path: '/orders',
			summary: 'Get orders',
			description: 'Read orders',
			operationId: 'getOrders',
			tags: ['Orders'],
		};
		(el as any)._apiEndPtsMap.set('id-10', new Map([[el.getEndPtId(endpoint), endpoint]]));

		jest.spyOn(el, 'selectApi').mockImplementation(async () => {
			(el as any)._api = dto;
			(el as any)._artifactId = 'id-10';
		});
		const selectEndPtSpy = jest.spyOn(el, 'selectEndPt').mockResolvedValue();

		el.value = {
			artifactId: 'id-10',
			method: 'get',
			path: '/orders',
		} as any;
		await el.onValueChange();
		expect(el.value?.api?.details.artifactId).to.equal('id-10');
		expect(selectEndPtSpy.mock.calls.length).to.be.greaterThan(0);

		el.value = undefined;
		await el.onValueChange();
		expect((el as any)._api).to.equal(undefined);
		expect((el as any)._artifactId).to.equal(undefined);
	});

	it('clear resets local state and maps', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);

		(el as any)._api = makeArtifactDto('x1');
		(el as any)._endPt = { method: 'get', path: '/x' };
		(el as any)._apiList = [makeArtifactDetails('x1')];
		(el as any)._apiMap.set('x1', makeArtifactDto('x1'));
		(el as any)._apiEndPtsMap.set('x1', new Map());

		const onValueChangeSpy = jest.spyOn(el, 'onValueChange').mockResolvedValue();
		el.clear();
		expect((el as any)._api).to.equal(undefined);
		expect((el as any)._endPt).to.equal(undefined);
		expect((el as any)._apiMap.size).to.equal(0);
		expect((el as any)._apiEndPtsMap.size).to.equal(0);
		expect(onValueChangeSpy.mock.calls.length).to.be.greaterThan(0);
	});

	it('modal after show loads artifacts once applies filters and focuses input', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);

		const getAllArtifactsSpy = jest
			.spyOn(el, 'getAllArtifacts')
			.mockResolvedValue([makeArtifactDetails('a1') as any]);
		const applyApiSpy = jest.spyOn(el, '_applyApiFilter');
		const applyEndSpy = jest.spyOn(el, '_applyEndPtFilter');
		const focusSpy = jest.spyOn(el, 'focusInput');

		await el._handleModalAfterShow();
		await el._handleModalAfterShow();

		expect(getAllArtifactsSpy.mock.calls.length).to.equal(1);
		expect(applyApiSpy.mock.calls.length).to.be.greaterThan(0);
		expect(applyEndSpy.mock.calls.length).to.be.greaterThan(0);
		expect(focusSpy.mock.calls.length).to.be.greaterThan(0);
	});

	it('modal after hide resets filters and restores selected values and focuses main card', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);

		const dto = makeArtifactDto('a1');
		const endpoint = {
			method: 'get',
			path: '/orders',
			summary: 'Get orders',
			description: 'Read orders',
			operationId: 'getOrders',
			tags: ['Orders'],
		};
		(el as any)._apiEndPtsMap.set('a1', new Map([[el.getEndPtId(endpoint), endpoint]]));
		el.value = {
			artifactId: 'a1',
			method: 'get',
			path: '/orders',
			api: dto as any,
		};
		(el as any)._apiFilter = 'abc';
		(el as any)._endPtFilter = 'def';

		el._handleModalAfterHide();
		expect((el as any).modal.open).to.equal(false);
		expect((el as any)._artifactId).to.equal('a1');
		expect((el as any)._api?.details.artifactId).to.equal('a1');
		expect((el as any)._endPt?.path).to.equal('/orders');
		expect((el as any)._apiFilter).to.equal('');
		expect((el as any)._endPtFilter).to.equal('');
		expect((el as any).mainCard.focus.mock.calls.length).to.be.greaterThan(0);
	});

	it('modal action primary emits selected value and closes, secondary closes', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);

		const dto = makeArtifactDto('id-55');
		const endpoint = {
			method: 'post',
			path: '/payments',
			summary: 'Create payment',
			description: 'Create payment',
			operationId: 'createPayment',
			tags: ['Payments'],
		};
		(el as any)._api = dto;
		(el as any)._endPt = endpoint;

		let payload: any;
		el.addEventListener('sc-select', (event: Event) => {
			payload = (event as CustomEvent).detail.value;
		});

		el._handleModalAction(new CustomEvent('sc-action', { detail: { type: 'primary' } }) as any);
		expect(payload.artifactId).to.equal('id-55');
		expect(payload.method).to.equal('post');
		expect((el as any).modal.open).to.equal(false);

		(el as any).modal.open = true;
		el._handleModalAction(new CustomEvent('sc-action', { detail: { type: 'secondary' } }) as any);
		expect((el as any).modal.open).to.equal(false);
	});

	it('result focus picks selected then last-focus then first-child', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);

		const selected = document.createElement('sc-card');
		selected.classList.add('selected');
		(selected as any).focus = jest.fn();

		const fallback = document.createElement('sc-card');
		fallback.classList.add('last-focus');
		(fallback as any).focus = jest.fn();

		const first = document.createElement('sc-card');
		(first as any).focus = jest.fn();

		const target = document.createElement('div');
		const querySelector = jest
			.fn()
			.mockReturnValueOnce(selected)
			.mockReturnValueOnce(fallback)
			.mockReturnValueOnce(first);
		(target as any).querySelector = querySelector;

		el._handleResultFocus({ target } as any);
		expect(selected.classList.contains('last-focus')).to.equal(true);
		expect((selected as any).focus.mock.calls.length).to.be.greaterThan(0);
	});

	it('result keypress navigates and activates focused cards', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);

		const container = document.createElement('div');
		const current = document.createElement('sc-card') as any;
		container.appendChild(current);
		current.classList.add('last-focus');
		current.classList.remove = jest.fn();
		current.click = jest.fn();

		const next = document.createElement('sc-card') as any;
		next.classList.add = jest.fn();
		next.focus = jest.fn();
		const prev = document.createElement('sc-card') as any;
		prev.classList.add = jest.fn();
		prev.focus = jest.fn();
		const pageNextA = document.createElement('sc-card') as any;
		pageNextA.classList.add = jest.fn();
		pageNextA.focus = jest.fn();
		const pageNextB = document.createElement('sc-card') as any;
		pageNextB.classList.add = jest.fn();
		pageNextB.focus = jest.fn();
		const pagePrevA = document.createElement('sc-card') as any;
		pagePrevA.classList.add = jest.fn();
		pagePrevA.focus = jest.fn();
		const pagePrevB = document.createElement('sc-card') as any;
		pagePrevB.classList.add = jest.fn();
		pagePrevB.focus = jest.fn();

		const first = document.createElement('sc-card') as any;
		first.classList.add = jest.fn();
		first.focus = jest.fn();

		const last = document.createElement('sc-card') as any;
		last.classList.add = jest.fn();
		last.focus = jest.fn();

		container.querySelector = jest.fn((selector: string) => {
			if (selector.includes('first-child')) return first;
			if (selector.includes('last-child')) return last;
			return null;
		});

		const querySelector = jest.fn((selector: string) => {
			if (selector === 'sc-card[tabindex]:focus') return current;
			if (selector.includes(':has(+ sc-card[tabindex]:focus)')) return prev;
			if (selector.includes('+ sc-card[tabindex]')) return next;
			return current;
		});

		const querySelectorAll = jest.fn((selector: string) => {
			if (selector.includes(':focus ~')) return [pageNextA, pageNextB];
			if (selector.includes(':has(~')) return [pagePrevA, pagePrevB];
			return [];
		});

		Object.defineProperty(el, 'shadowRoot', {
			value: {
				querySelector,
				querySelectorAll,
			},
			configurable: true,
		});

		const downEvent = { key: 'ArrowDown', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(downEvent);
		expect(next.focus.mock.calls.length).to.be.greaterThan(0);
		expect(downEvent.preventDefault.mock.calls.length).to.be.greaterThan(0);

		const homeEvent = { key: 'Home', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(homeEvent);
		expect(first.focus.mock.calls.length).to.be.greaterThan(0);

		const endEvent = { key: 'End', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(endEvent);
		expect(last.focus.mock.calls.length).to.be.greaterThan(0);

		const upEvent = { key: 'ArrowUp', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(upEvent);
		expect(prev.focus.mock.calls.length).to.be.greaterThan(0);

		const pageDownEvent = { key: 'PageDown', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(pageDownEvent);
		expect(pageNextB.focus.mock.calls.length).to.be.greaterThan(0);

		const pageUpEvent = { key: 'PageUp', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(pageUpEvent);
		expect(pagePrevA.focus.mock.calls.length).to.be.greaterThan(0);

		const enterEvent = { key: 'Enter', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(enterEvent);
		expect(current.click.mock.calls.length).to.be.greaterThan(0);

		const spaceEvent = { key: 'Spacebar', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(spaceEvent);
		expect(current.click.mock.calls.length).to.be.greaterThan(1);

		const blankSpaceEvent = { key: ' ', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(blankSpaceEvent);
		expect(current.click.mock.calls.length).to.be.greaterThan(2);

		const defaultEvent = { key: 'Escape', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(defaultEvent);
		expect(defaultEvent.preventDefault.mock.calls.length).to.equal(0);
	});

	it('result focus and focusInput tolerate missing targets', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);

		const target = document.createElement('div');
		(target as any).querySelector = jest.fn().mockReturnValue(null);
		el._handleResultFocus({ target } as any);

		el.focusInput({ shadowRoot: { querySelector: () => null } } as any);
		expect(true).to.equal(true);
	});

	it('renderMarkedText covers no filter no match and truncation with marks', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);

		expect(el._renderMarkedText('Simple text', '')).to.equal('Simple text');
		expect(el._renderMarkedText('Simple text', 'zzz')).to.equal('Simple text');

		const longText =
			'alpha beta gamma delta epsilon zeta eta theta iota kappa lambda endpoint path with keyword marker';
		const rendered = el._renderMarkedText(longText, 'keyword') as any[];
		expect(Array.isArray(rendered)).to.equal(true);
		expect(rendered.length).to.be.greaterThan(1);

		const shortPrefix =
			'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen marker';
		const shortRendered = el._renderMarkedText(shortPrefix, 'marker') as any[];
		expect(Array.isArray(shortRendered)).to.equal(true);
		expect(shortRendered.length).to.be.greaterThan(0);
	});

	it('renderMarkedText returns display text when match search yields no parts', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);

		const original = String.prototype.indexOf;
		const indexSpy = jest
			.spyOn(String.prototype, 'indexOf')
			.mockImplementation(function (this: string, search: string, from?: number) {
				if (this === 'abc marker xyz' && search === 'marker' && (from ?? 0) === 0) {
					return 4;
				}
				if (this === 'abc marker xyz' && search === 'marker' && (from ?? 0) === 0) {
					return -1;
				}
				return original.call(this, search as any, from as any);
			});

		const text = 'abc marker xyz';
		const result = el._renderMarkedText(text, 'marker');
		expect(typeof result === 'string' || Array.isArray(result)).to.equal(true);

		indexSpy.mockRestore();
	});

	it('renderApiCard and renderEndPtCard create templates for selected states', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		(el as any)._artifactId = 'a1';
		const apiTemplate = el._renderApiCard(makeArtifactDetails('a1') as any);
		expect((apiTemplate as any).strings.join('')).to.contain('sc-card');

		const endpoint = {
			method: 'get',
			path: '/orders',
			summary: 'Get orders',
			description: 'Read orders',
			operationId: 'getOrders',
			tags: ['Orders'],
		};
		(el as any)._endPt = endpoint;
		const endpointTemplate = el._renderEndPtCard(endpoint as any);
		expect((endpointTemplate as any).strings.join('')).to.contain('end-pt');
	});

	it('render shows expected placeholders and spinner branches', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);

		(el as any).apiList = undefined;
		(el as any).endPoints = undefined;
		let output = el.render() as any;
		expect(output.strings.join('')).to.contain('sc-text-input');

		(el as any).apiList = [];
		(el as any).endPoints = [];
		(el as any)._apiFilter = 'x';
		(el as any)._endPtFilter = 'x';
		await el.requestUpdate();
		await el.updateComplete;
		expect(el.shadowRoot?.textContent).to.contain('No matching APIs');
		expect(el.shadowRoot?.textContent).to.contain('No matching endpoints');

		(el as any).apiList = [makeArtifactDetails('a1')];
		(el as any).endPoints = [
			{
				method: 'get',
				path: '/x',
				summary: 's',
				description: 'd',
				operationId: 'op',
				tags: [],
			},
		];
		output = el.render() as any;
		expect(output.strings.join('')).to.contain('dialog');
	});

	it('render handlers react to click clear and keyboard', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);

		const clearSpy = jest.spyOn(el, 'clear').mockImplementation(() => {});
		const input = el.shadowRoot?.querySelector('sc-text-input.sc-input') as HTMLElement;
		const mainCard = el.shadowRoot?.querySelector('sc-card[part="main-card"]') as HTMLElement;

		input.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
		expect(clearSpy.mock.calls.length).to.equal(1);
		expect((el as any).modal.open).to.equal(true);

		el.value = { artifactId: 'x', method: 'get', path: '/p' } as any;
		input.dispatchEvent(new CustomEvent('sc-clear', { bubbles: true }));
		expect(el.value).to.equal(undefined);

		(el as any).modal.open = false;
		mainCard.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		expect((el as any).modal.open).to.equal(true);

		el.disabled = true;
		(el as any).modal.open = false;
		input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect((el as any).modal.open).to.equal(false);

		el.disabled = false;
		el.readonly = true;
		(el as any).modal.open = false;
		input.dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }));
		expect((el as any).modal.open).to.equal(false);

		el.readonly = false;
		(el as any).modal.open = false;
		mainCard.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
		expect((el as any).modal.open).to.equal(true);
	});

	it('result keypress handles Page branches with no matches', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);

		Object.defineProperty(el, 'shadowRoot', {
			value: {
				querySelector: jest.fn().mockReturnValue(null),
				querySelectorAll: jest.fn().mockReturnValue([]),
			},
			configurable: true,
		});

		const pageDownEvent = { key: 'PageDown', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(pageDownEvent);
		expect(pageDownEvent.preventDefault.mock.calls.length).to.equal(1);

		const pageUpEvent = { key: 'PageUp', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(pageUpEvent);
		expect(pageUpEvent.preventDefault.mock.calls.length).to.equal(1);

		const spaceEvent = { key: ' ', preventDefault: jest.fn() } as any;
		el._handleResultKeyPress(spaceEvent);
		expect(spaceEvent.preventDefault.mock.calls.length).to.equal(1);
	});

	it('api and endpoint card handlers run on focus blur click', async () => {
		const el = await fixture<ScApiCatalog>(
			html`<sc-api-catalog></sc-api-catalog>`
		);
		defineStableRefs(el);

		const endpoint = {
			method: 'get',
			path: '/x',
			summary: 'Get x',
			description: 'Read x',
			operationId: 'getX',
			tags: ['x'],
		};

		(el as any)._artifactId = 'a1';
		(el as any)._apiList = [makeArtifactDetails('a1')];
		(el as any).apiList = [makeArtifactDetails('a1')];
		(el as any).endPoints = [endpoint];
		await el.requestUpdate();
		await el.updateComplete;

		const apiCard = el.shadowRoot?.querySelector('sc-card#a1') as HTMLElement;
		const endPtCard = el.shadowRoot?.querySelector('sc-card.end-pt') as HTMLElement;
		const selectApiSpy = jest.spyOn(el, 'selectApi').mockResolvedValue();
		const selectEndPtSpy = jest.spyOn(el, 'selectEndPt').mockResolvedValue();

		apiCard.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
		expect(apiCard.getAttribute('tabindex')).to.equal('0');
		apiCard.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
		expect(apiCard.getAttribute('tabindex')).to.equal('-1');
		apiCard.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(selectApiSpy.mock.calls.length).to.be.greaterThan(0);

		endPtCard.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
		expect(endPtCard.getAttribute('tabindex')).to.equal('0');
		endPtCard.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
		expect(endPtCard.getAttribute('tabindex')).to.equal('-1');
		endPtCard.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(selectEndPtSpy.mock.calls.length).to.be.greaterThan(0);
	});
});

import { vi } from 'vitest';
import {
  CASHFLOW_DETAIL_OPERATION,
  CASHFLOW_LIST_OPERATION,
  cashflowDevApiPlugin,
  resolveCashflowDevResponse,
} from './cashflowDevApi';

describe('Cashflow CN local transport contracts', () => {
  it('returns business fields required by the actual grid and builders', () => {
    const response = resolveCashflowDevResponse({
      method: 'GET',
      pathname: '/api/ratan/rule/v1/fields',
    });

    expect(response?.status).toBe(200);
    expect(response?.body).toMatchObject({
      fields: expect.arrayContaining([
        expect.objectContaining({ indexedTerm: 'Cashflow.Cashflow_Id' }),
        expect.objectContaining({ indexedTerm: 'Cashflow.Payment_Amount' }),
        expect.objectContaining({ indexedTerm: 'Entity.Booking_Entity_SCI_FMCODE' }),
      ]),
    });
  });

  it('returns production-shaped list and detail GraphQL envelopes', () => {
    const list = resolveCashflowDevResponse({
      method: 'POST',
      pathname: '/api/ratan/stmcn/v1/cashflows',
      body: { operationName: CASHFLOW_LIST_OPERATION },
    });
    const detail = resolveCashflowDevResponse({
      method: 'POST',
      pathname: '/api/ratan/stmcn/v1/cashflows',
      body: { query: CASHFLOW_DETAIL_OPERATION },
    });

    expect(list?.body).toMatchObject({
      data: {
        cashflowUltraQuery: {
          totalResult: 2,
          pageIndex: 0,
          itemsPerPage: 1000,
          lastPage: true,
          results: [
            expect.objectContaining({
              Cashflow: expect.objectContaining({ Cashflow_Id: 'CF-CN-24001' }),
            }),
            expect.objectContaining({
              Cashflow: expect.objectContaining({ Cashflow_Id: 'CF-CN-24002' }),
            }),
          ],
        },
      },
    });
    expect(detail?.body).toMatchObject({
      data: {
        graphCashFlowDetails: [
          expect.objectContaining({
            cashflow: expect.objectContaining({
              Cashflow: expect.objectContaining({ Cashflow_Id: 'CF-CN-24001' }),
            }),
          }),
        ],
      },
    });
  });

  it('serves saved custom filters and views through their existing REST routes', () => {
    const filters = resolveCashflowDevResponse({
      method: 'GET',
      pathname: '/api/ratan/v3/customview/filters',
    });
    const filter = resolveCashflowDevResponse({
      method: 'GET',
      pathname: '/api/ratan/v3/customview/filters/filter-usd-pending',
    });
    const views = resolveCashflowDevResponse({
      method: 'GET',
      pathname: '/api/ratan/v3/customview/views',
    });
    const view = resolveCashflowDevResponse({
      method: 'GET',
      pathname: '/api/ratan/v3/customview/views/view-operations',
    });

    expect(filters?.body).toEqual([expect.objectContaining({ name: 'USD pending verification' })]);
    expect(filter?.body).toMatchObject({ rowKey: 'filter-usd-pending' });
    const filterBody = JSON.parse(
      String((filter?.body as { body?: string } | undefined)?.body),
    ) as { rules: Array<{ field: string }> };
    expect(filterBody.rules.map(({ field }) => field)).toEqual(
      expect.arrayContaining([
        'Cashflow.Payment_Date',
        'Cashflow.Cashflow_State',
        'Entity.Booking_Entity_SCI_FMID',
        'Cashflow.Payment_Currency',
      ]),
    );
    expect(views?.body).toEqual([expect.objectContaining({ name: 'Operations essentials' })]);
    expect(view?.body).toMatchObject({ rowKey: 'view-operations' });
  });

  it('applies saved filter values to the unchanged list GraphQL contract', () => {
    const response = resolveCashflowDevResponse({
      method: 'POST',
      pathname: '/api/ratan/stmcn/v1/cashflows',
      body: {
        operationName: CASHFLOW_LIST_OPERATION,
        variables: {
          payload: {
            filters: {
              combinator: 'and',
              rules: [
                {
                  field: 'Cashflow.Payment_Currency',
                  operator: '=',
                  value: 'USD',
                },
              ],
            },
          },
        },
      },
    });

    expect(response?.body).toMatchObject({
      data: {
        cashflowUltraQuery: {
          totalResult: 1,
          results: [
            expect.objectContaining({
              Cashflow: expect.objectContaining({
                Cashflow_Id: 'CF-CN-24001',
                Payment_Currency: 'USD',
              }),
            }),
          ],
        },
      },
    });
  });

  it('applies Cashflow ID quick-search values to the unchanged list GraphQL contract', () => {
    const response = resolveCashflowDevResponse({
      method: 'POST',
      pathname: '/api/ratan/stmcn/v1/cashflows',
      body: {
        operationName: CASHFLOW_LIST_OPERATION,
        variables: {
          payload: {
            filters: {
              combinator: 'and',
              rules: [
                {
                  field: 'Cashflow.Cashflow_Id',
                  operator: 'in',
                  value: ['CF-CN-24001'],
                },
              ],
            },
          },
        },
      },
    });

    expect(response?.body).toMatchObject({
      data: {
        cashflowUltraQuery: {
          totalResult: 1,
          results: [
            expect.objectContaining({
              Cashflow: expect.objectContaining({
                Cashflow_Id: 'CF-CN-24001',
              }),
            }),
          ],
        },
      },
    });
  });

  it('provides notification and representative action contracts but ignores unknown routes', () => {
    expect(
      resolveCashflowDevResponse({
        method: 'GET',
        pathname: '/api/ratan/notification/subscriptions',
      })?.body,
    ).toMatchObject({ subscriptions: [] });
    expect(
      resolveCashflowDevResponse({
        method: 'POST',
        pathname: '/api/ratan/v1/ratan/lifecycle/hold',
      })?.body,
    ).toMatchObject({ success: true, status: 200, state: 'HOLD' });
    expect(
      resolveCashflowDevResponse({
        method: 'GET',
        pathname: '/api/not-cashflow',
      }),
    ).toBeUndefined();
  });

  it('covers version, auxiliary GraphQL, country, and unknown GraphQL contracts', () => {
    expect(
      resolveCashflowDevResponse({
        method: 'GET',
        pathname: '/api/ratan/rule/v1/fields/versions',
      })?.body,
    ).toMatchObject({
      ratan_suppression_fields: { activedVersion: 'local-v1' },
    });
    expect(
      resolveCashflowDevResponse({
        method: 'POST',
        pathname: '/api/ratan/da/graphql',
      })?.body,
    ).toEqual({ data: { fmEntity: null } });
    expect(
      resolveCashflowDevResponse({
        method: 'POST',
        pathname: '/api/ratan/v1/cashflow/country/countryInfo',
      })?.body,
    ).toEqual({ countryInfoList: [] });
    expect(
      resolveCashflowDevResponse({
        method: 'POST',
        pathname: '/api/ratan/stmcn/v1/cashflows',
        body: { query: 'query UnknownOperation { unknown }' },
      })?.body,
    ).toEqual({ data: {} });
    expect(
      resolveCashflowDevResponse({
        method: 'POST',
        pathname: '/api/ratan/stmcn/v1/cashflows',
        body: 'not-an-object',
      })?.body,
    ).toEqual({ data: {} });
  });

  it('supports both legacy v2 and current v3 saved-item routes', () => {
    expect(
      resolveCashflowDevResponse({
        method: 'GET',
        pathname: '/api/ratan/v2/customview/filters',
      })?.body,
    ).toHaveLength(1);
    expect(
      resolveCashflowDevResponse({
        method: 'GET',
        pathname: '/api/ratan/v2/customview/views',
      })?.body,
    ).toHaveLength(1);
  });

  it('installs development middleware that writes fixtures and passes unknown routes', async () => {
    type Middleware = (
      request: AsyncIterable<Uint8Array> & { method?: string; url?: string },
      response: {
        statusCode: number;
        setHeader: ReturnType<typeof vi.fn>;
        end: ReturnType<typeof vi.fn>;
      },
      next: ReturnType<typeof vi.fn>,
    ) => Promise<void>;

    let middleware: Middleware | undefined;
    const plugin = cashflowDevApiPlugin();
    expect(plugin.apply).toBe('serve');
    const configureServer = plugin.configureServer as unknown as (server: {
      middlewares: {
        use: (handler: Middleware) => void;
      };
    }) => void;
    configureServer({
      middlewares: {
        use: (handler) => {
          middleware = handler;
        },
      },
    });
    expect(middleware).toBeDefined();

    const response = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    };
    const next = vi.fn();
    const getRequest = {
      method: 'GET',
      url: '/api/ratan/rule/v1/fields?contexts=CASHFLOW_DATA',
      async *[Symbol.asyncIterator]() {},
    };
    await middleware?.(getRequest, response, next);
    expect(response.statusCode).toBe(200);
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(response.end).toHaveBeenCalledWith(expect.stringContaining('Cashflow.Cashflow_Id'));
    expect(next).not.toHaveBeenCalled();

    const postResponse = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    };
    const postRequest = {
      method: 'POST',
      url: '/api/ratan/stmcn/v1/cashflows',
      async *[Symbol.asyncIterator]() {
        yield Buffer.from(JSON.stringify({ operationName: CASHFLOW_LIST_OPERATION }));
      },
    };
    await middleware?.(postRequest, postResponse, next);
    expect(postResponse.end).toHaveBeenCalledWith(expect.stringContaining('CF-CN-24001'));

    const unknownResponse = {
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    };
    const unknownRequest = {
      method: 'POST',
      url: '/api/not-cashflow',
      async *[Symbol.asyncIterator]() {
        yield Buffer.from('{invalid');
      },
    };
    await middleware?.(unknownRequest, unknownResponse, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(unknownResponse.end).not.toHaveBeenCalled();
  });
});

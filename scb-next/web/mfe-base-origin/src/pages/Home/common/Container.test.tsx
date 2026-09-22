import { render, screen } from '@testing-library/react';
import React from 'react';
import Container from './Container';
import Provider from '../../../hooks/provider';
import ThemeProvider from '../../../theme';
import { Container as ContainerProps } from '../../../hooks/model/workspaces';
afterAll(() => {
  vi.clearAllMocks();
});
const Comp = (props: ContainerProps) => {
  return <Container {...props} />;
};

describe('Container component', () => {
  it('renders the Alpha Payments federated application', async () => {
    render(
      <Provider data={{ user: { id: '123' }, token: '123', theme: 'dark', newStyles: true }}>
        <ThemeProvider>
          <Comp
            id="alpha-payments"
            container="@fm/alpha_payments"
            module="/payment-investigation"
            tile="/payment-investigation"
            title="Payment Investigation"
            emailSupport="alpha-payments-support@example.test"
            tabId="alpha-tab"
            panelId="alpha-panel"
          />
        </ThemeProvider>
      </Provider>,
    );

    expect(await screen.findByText('Alpha Payments remote test')).toBeTruthy();
    const remote = screen.getByTestId('remote-alpha-payments-stub');
    expect(remote).toHaveAttribute('data-mode', 'dark');
    expect(remote).toHaveAttribute('data-generation', 'webkit');
  });

  it('TEMPLATE_CONTAINER should be in the document', () => {
    render(
      <Provider data={{ user: { id: '123' }, token: '123', theme: 'dark' }}>
        <ThemeProvider>
          <Comp
            id="1"
            container="@fm/template_container"
            module=""
            tile=""
            title=""
            emailSupport=""
            tabId="123"
            panelId="123"
          />
        </ThemeProvider>
      </Provider>,
    );
    expect(screen).toBeDefined();
  });
  it('TEMPLATE_CONTAINER should be in the document', () => {
    render(
      <Provider data={{ user: { id: '123' }, token: '123', theme: 'dark' }}>
        <ThemeProvider>
          <Comp
            id="1"
            container="@fm/template_container"
            module=""
            tile=""
            title=""
            emailSupport=""
            parameters={{ abc: 123 }}
            tabId="123"
            panelId="123"
            leftPosition="calc(50% - 45px)"
            topPossition="6px"
          />
        </ThemeProvider>
      </Provider>,
    );
    expect(screen).toBeDefined();
  });
  it('passes explicit mode and generation to the Ratan container', async () => {
    render(
      <Provider data={{ user: { id: '123' }, token: '123', theme: 'dark', newStyles: true }}>
        <ThemeProvider>
          <Comp
            id="1"
            container="@fm/ratan_container"
            module=""
            tile=""
            title=""
            emailSupport=""
            tabId="123"
            panelId="123"
            leftPosition="calc(50% - 45px)"
            topPossition="6px"
          />
        </ThemeProvider>
      </Provider>,
    );
    const remote = await screen.findByTestId('remote-ratan-stub');
    expect(remote).toHaveAttribute('data-mode', 'dark');
    expect(remote).toHaveAttribute('data-generation', 'webkit');
  });
  it('RATAN_CONTAINER should be in the document', () => {
    render(
      <Provider data={{ user: { id: '123' }, token: '123', theme: 'dark' }}>
        <ThemeProvider>
          <Comp
            id="1"
            container="@FM/RATAN_CONTAINER"
            module=""
            tile=""
            title=""
            emailSupport=""
            parameters={{ abc: 123 }}
            tabId="123"
            panelId="123"
            leftPosition="calc(50% - 45px)"
            topPossition="6px"
          />
        </ThemeProvider>
      </Provider>,
    );
    expect(screen).toBeDefined();
  });
  it('X_CONTAINER should be in the document', () => {
    render(
      <Provider data={{ user: { id: '123' }, token: '123', theme: 'dark' }}>
        <ThemeProvider>
          <Comp
            id="1"
            container="x"
            module=""
            tile=""
            title=""
            emailSupport=""
            tabId="123"
            panelId="123"
            leftPosition="calc(50% - 45px)"
            topPossition="6px"
          />
        </ThemeProvider>
      </Provider>,
    );
    expect(screen).toBeDefined();
  });
  it('X_CONTAINER should be in the document', () => {
    render(
      <Provider data={{ user: { id: '123' }, token: '123', theme: 'dark' }}>
        <ThemeProvider>
          <Comp
            id="1"
            container="x"
            module=""
            tile=""
            title=""
            emailSupport=""
            parameters={{ abc: 123 }}
            tabId="123"
            panelId="123"
            leftPosition="calc(50% - 45px)"
            topPossition="6px"
          />
        </ThemeProvider>
      </Provider>,
    );
    expect(screen).toBeDefined();
  });
  it('@fm/base should be in the document', () => {
    render(
      <Provider data={{ user: { id: '123' }, token: '123', theme: 'dark' }}>
        <ThemeProvider>
          <Comp
            id="1"
            container="@fm/base"
            module="/importmap"
            tile="/importmap"
            title="Import Map"
            emailSupport=""
            parameters={{ abc: 123 }}
            tabId="123"
            panelId="123"
            leftPosition="calc(50% - 45px)"
            topPossition="6px"
          />
        </ThemeProvider>
      </Provider>,
    );
    expect(screen).toBeDefined();
  });

  it('@fm/base should be in the document', () => {
    render(
      <Provider data={{ user: { id: '123' }, token: '123', theme: 'dark' }}>
        <ThemeProvider>
          <Comp
            id="1"
            container="@fm/base"
            module="/importmap"
            tile="/importmap"
            title="Import Map"
            emailSupport=""
            tabId="123"
            panelId="123"
            leftPosition="calc(50% - 45px)"
            topPossition="6px"
          />
        </ThemeProvider>
      </Provider>,
    );
    expect(screen).toBeDefined();
  });
});

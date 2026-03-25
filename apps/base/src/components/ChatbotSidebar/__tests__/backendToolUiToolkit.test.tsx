import React from 'react';
import { render, screen } from '@testing-library/react';
import { GenerativeUIProvider } from '../common/GenerativeUI';
import { createBackendToolUiToolkit } from '../tools/backendToolUiToolkit';

describe('backendToolUiToolkit', () => {
  it('renders embedded generative UI metadata through the registry inside a backend tool card', () => {
    const toolkit = createBackendToolUiToolkit();
    const WeatherToolUi = toolkit.get_weather.render;

    if (!WeatherToolUi) {
      throw new Error('Expected get_weather tool UI renderer to exist');
    }

    render(
      <GenerativeUIProvider
        initialComponents={[
          {
            name: 'ChartCard',
            component: ({ props }) => (
              <div data-testid="embedded-generative-ui">{String(props.title ?? '')}</div>
            ),
          },
        ]}
      >
        <WeatherToolUi
          toolCallId="tool-1"
          toolName="get_weather"
          args={{ location: 'Shanghai, China' }}
          argsText='{"location":"Shanghai, China"}'
          result={{
            location: 'Shanghai, China',
            __assistantUiGenerativeUi: {
              componentName: 'ChartCard',
              props: { title: 'Weather Summary' },
            },
          }}
        />
      </GenerativeUIProvider>,
    );

    expect(screen.getByText('Weather')).toBeInTheDocument();
    expect(screen.getByText('Location: Shanghai, China')).toBeInTheDocument();
    expect(screen.getByTestId('embedded-generative-ui')).toHaveTextContent('Weather Summary');
  });
});

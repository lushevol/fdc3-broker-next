import { render, screen } from '@testing-library/react';
import { theme as antTheme } from 'antd';
import { useTheme } from '@mui/material/styles';
import MfeThemeProvider from '.';
import LazyAntdTheme from '../../../LazyAntd/Theme/AntdTheme';

function DensityProbe() {
  const mui = useTheme();
  const { token } = antTheme.useToken();
  return (
    <output
      aria-label="Control density"
      data-mui-family={mui.typography.fontFamily}
      data-ant-family={token.fontFamily}
      data-ant-size={token.fontSize}
      data-ant-height={token.controlHeight}
      data-ant-small-height={token.controlHeightSM}
    />
  );
}

describe('Ratan control density', () => {
  it.each([false, true])(
    'updates Ant typography and density when generation changes (lazy=%s)',
    (lazy) => {
      const content = lazy ? (
        <LazyAntdTheme>
          <DensityProbe />
        </LazyAntdTheme>
      ) : (
        <DensityProbe />
      );
      const { rerender } = render(
        <MfeThemeProvider appearance={{ mode: 'light', designGeneration: 'webkit' }}>
          {content}
        </MfeThemeProvider>,
      );
      const output = screen.getByLabelText('Control density');
      expect(output).toHaveAttribute('data-ant-family', output.getAttribute('data-mui-family'));
      expect(output).toHaveAttribute('data-ant-size', '12');
      expect(output).toHaveAttribute('data-ant-height', '32');
      expect(output).toHaveAttribute('data-ant-small-height', '28');
      rerender(
        <MfeThemeProvider appearance={{ mode: 'light', designGeneration: 'legacy' }}>
          {content}
        </MfeThemeProvider>,
      );
      expect(output.getAttribute('data-ant-family')).toContain('Poppins');
      expect(output).toHaveAttribute('data-ant-small-height', '24');
    },
  );
});

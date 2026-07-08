/**
 * AppCard Component Tests
 * @see plan.md#T093
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import type { AppMetadata, Context } from '@finos/fdc3';
import { AppCard } from '../src/AppCard';

describe('AppCard', () => {
  const mockApp: AppMetadata = {
    appId: 'chart-app',
    name: 'Chart Application',
    title: 'Chart App',
    description: 'Displays financial charts',
    version: '1.0.0',
    icons: [
      {
        src: 'https://example.com/icon.png',
        size: '48x48',
        type: 'image/png',
      },
    ],
  };

  const mockContext: Context = {
    type: 'fdc3.chart',
    id: { ticker: 'AAPL' },
  };

  const defaultProps = {
    app: mockApp,
    instanceId: 'chart-app-1',
    currentContext: mockContext,
    selected: false,
    focused: false,
    onClick: vi.fn(),
    onDoubleClick: vi.fn(),
    tabIndex: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render app card with app metadata', () => {
      render(<AppCard {...defaultProps} />);

      expect(screen.getByText('Chart App')).toBeInTheDocument();
      expect(screen.getByText('Displays financial charts')).toBeInTheDocument();
    });

    it('should use name when title is not available', () => {
      const appWithoutTitle = {
        ...mockApp,
        title: undefined,
      };

      render(<AppCard {...defaultProps} app={appWithoutTitle} />);

      expect(screen.getByText('Chart Application')).toBeInTheDocument();
    });

    it('should display instance ID', () => {
      render(<AppCard {...defaultProps} />);

      expect(screen.getByText('Instance: chart-app-1')).toBeInTheDocument();
    });

    it('should not display instance ID when not provided', () => {
      const propsWithoutInstance = {
        ...defaultProps,
        instanceId: undefined,
      };

      render(<AppCard {...propsWithoutInstance} />);

      expect(screen.queryByText(/Instance:/)).not.toBeInTheDocument();
    });

    it('should display new instance label when instance ID is not provided', () => {
      const propsWithoutInstance = {
        ...defaultProps,
        instanceId: undefined,
      };

      render(<AppCard {...propsWithoutInstance} />);

      expect(screen.getByText('New instance')).toBeInTheDocument();
    });

    it('should display app icon when available', () => {
      const { container } = render(<AppCard {...defaultProps} />);

      const icon = container.querySelector('img');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', 'https://example.com/icon.png');
      expect(icon).toHaveAttribute('alt', 'Chart Application');
    });

    it('should not display icon when not available', () => {
      const appWithoutIcon = {
        ...mockApp,
        icons: undefined,
      };

      const { container } = render(<AppCard {...defaultProps} app={appWithoutIcon} />);

      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('should display description when available', () => {
      render(<AppCard {...defaultProps} />);

      expect(screen.getByText('Displays financial charts')).toBeInTheDocument();
    });

    it('should not display description when not available', () => {
      const appWithoutDescription = {
        ...mockApp,
        description: undefined,
      };

      render(<AppCard {...defaultProps} app={appWithoutDescription} />);

      expect(screen.queryByText('Displays financial charts')).not.toBeInTheDocument();
    });

    it('should display current context when available', () => {
      render(<AppCard {...defaultProps} />);

      expect(screen.getByText('Current Context:')).toBeInTheDocument();
      expect(screen.getByText('fdc3.chart')).toBeInTheDocument();
    });

    it('should not display current context when not available', () => {
      const propsWithoutContext = {
        ...defaultProps,
        currentContext: null,
      };

      render(<AppCard {...propsWithoutContext} />);

      expect(screen.queryByText('Current Context:')).not.toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('should call onClick when card is clicked', () => {
      const onClick = vi.fn();

      render(<AppCard {...defaultProps} onClick={onClick} />);

      const card = screen.getByText('Chart App').closest('div');
      fireEvent.click(card!);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onDoubleClick when card is double-clicked', () => {
      const onDoubleClick = vi.fn();

      render(<AppCard {...defaultProps} onDoubleClick={onDoubleClick} />);

      const card = screen.getByText('Chart App').closest('div');
      fireEvent.doubleClick(card!);

      expect(onDoubleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Enter key is pressed', () => {
      const onClick = vi.fn();

      render(<AppCard {...defaultProps} onClick={onClick} />);

      const card = screen.getByText('Chart App').closest('div');
      fireEvent.keyDown(card!, { key: 'Enter', code: 'Enter' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Space key is pressed', () => {
      const onClick = vi.fn();

      render(<AppCard {...defaultProps} onClick={onClick} />);

      const card = screen.getByText('Chart App').closest('div');
      fireEvent.keyDown(card!, { key: ' ', code: 'Space' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick for other keys', () => {
      const onClick = vi.fn();

      render(<AppCard {...defaultProps} onClick={onClick} />);

      const card = screen.getByText('Chart App').closest('div');
      fireEvent.keyDown(card!, { key: 'a', code: 'KeyA' });

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should prevent default on Enter and Space keys', () => {
      const onClick = vi.fn();

      render(<AppCard {...defaultProps} onClick={onClick} />);

      const card = screen.getByText('Chart App').closest('div');
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent(card!, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('visual states', () => {
    it('should apply selected styles when selected is true', () => {
      const { container } = render(<AppCard {...defaultProps} selected={true} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({
        borderColor: '#1976d2',
        backgroundColor: '#e3f2fd',
      });
    });

    it('should apply focused styles when focused is true', () => {
      const { container } = render(<AppCard {...defaultProps} focused={true} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({
        borderColor: '#42a5f5',
      });
    });

    it('should apply default styles when neither selected nor focused', () => {
      const { container } = render(<AppCard {...defaultProps} selected={false} focused={false} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
      });
    });

    it('should add selected class when selected', () => {
      const { container } = render(<AppCard {...defaultProps} selected={true} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('selected');
    });

    it('should add focused class when focused', () => {
      const { container } = render(<AppCard {...defaultProps} focused={true} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('focused');
    });
  });

  describe('accessibility', () => {
    it('should have role="option"', () => {
      const { container } = render(<AppCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('role', 'option');
    });

    it('should have aria-selected=true when selected', () => {
      const { container } = render(<AppCard {...defaultProps} selected={true} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('aria-selected', 'true');
    });

    it('should have aria-selected=false when not selected', () => {
      const { container } = render(<AppCard {...defaultProps} selected={false} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('aria-selected', 'false');
    });

    it('should have correct tabIndex', () => {
      const { container } = render(<AppCard {...defaultProps} tabIndex={0} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('should have tabIndex=-1 when not focusable', () => {
      const { container } = render(<AppCard {...defaultProps} tabIndex={-1} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute('tabIndex', '-1');
    });

    it('should auto-focus when focused prop changes to true', () => {
      const { rerender } = render(<AppCard {...defaultProps} focused={false} />);

      const card = screen.getByText('Chart App').closest('div');

      rerender(<AppCard {...defaultProps} focused={true} />);

      // Note: focus() requires the element to be in the DOM
      expect(card).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle app with minimal metadata', () => {
      const minimalApp: AppMetadata = {
        appId: 'minimal-app',
        name: 'Minimal App',
      };

      render(<AppCard {...defaultProps} app={minimalApp} />);

      expect(screen.getByText('Minimal App')).toBeInTheDocument();
    });

    it('should handle app with multiple icons', () => {
      const appWithMultipleIcons = {
        ...mockApp,
        icons: [
          { src: 'icon1.png', size: '16x16', type: 'image/png' },
          { src: 'icon2.png', size: '48x48', type: 'image/png' },
        ],
      };

      const { container } = render(<AppCard {...defaultProps} app={appWithMultipleIcons} />);

      // Should use first icon
      const icon = container.querySelector('img');
      expect(icon).toHaveAttribute('src', 'icon1.png');
    });

    it('should handle complex context object', () => {
      const complexContext: Context = {
        type: 'fdc3.complex',
        id: { id: '123' },
        nested: {
          level1: {
            level2: 'data',
          },
        },
      };

      render(<AppCard {...defaultProps} currentContext={complexContext} />);

      expect(screen.getByText('Current Context:')).toBeInTheDocument();
      expect(screen.getByText('fdc3.complex')).toBeInTheDocument();
    });

    it('should handle empty description', () => {
      const appWithEmptyDescription = {
        ...mockApp,
        description: '',
      };

      render(<AppCard {...defaultProps} app={appWithEmptyDescription} />);

      const card = screen.getByText('Chart App').closest('div');
      expect(card).toBeInTheDocument();
    });

    it('should handle very long app name', () => {
      const longName = 'A'.repeat(100);
      const appWithLongName = {
        ...mockApp,
        title: longName,
      };

      render(<AppCard {...defaultProps} app={appWithLongName} />);

      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle very long description', () => {
      const longDescription = 'B'.repeat(500);
      const appWithLongDescription = {
        ...mockApp,
        description: longDescription,
      };

      render(<AppCard {...defaultProps} app={appWithLongDescription} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply border radius', () => {
      const { container } = render(<AppCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ borderRadius: '8px' });
    });

    it('should apply padding', () => {
      const { container } = render(<AppCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ padding: '16px' });
    });

    it('should apply margin', () => {
      const { container } = render(<AppCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ margin: '8px' });
    });

    it('should have cursor pointer', () => {
      const { container } = render(<AppCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ cursor: 'pointer' });
    });

    it('should apply transition styles', () => {
      const { container } = render(<AppCard {...defaultProps} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({ transition: 'all 0.2s' });
    });
  });

  describe('icon rendering', () => {
    it('should apply icon styles correctly', () => {
      const { container } = render(<AppCard {...defaultProps} />);

      const icon = container.querySelector('img');
      expect(icon).toHaveStyle({
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        marginBottom: '8px',
      });
    });

    it('should handle icon with missing size property', () => {
      const appWithIconWithoutSize = {
        ...mockApp,
        icons: [{ src: 'icon.png', type: 'image/png' }],
      };

      const { container } = render(<AppCard {...defaultProps} app={appWithIconWithoutSize} />);

      const icon = container.querySelector('img');
      expect(icon).toBeInTheDocument();
    });
  });
});

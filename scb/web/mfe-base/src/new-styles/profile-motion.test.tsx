import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { useProfileReducedMotion } from './profile-motion';

const MotionStatus = () => <span>{String(useProfileReducedMotion())}</span>;

describe('profile motion preference boundaries', () => {
  it('renders safely when server rendering has no media-query subscription', () => {
    vi.stubGlobal('window', undefined);
    expect(renderToString(<MotionStatus />)).toContain('false');
    vi.unstubAllGlobals();
  });

  it('uses normal motion when the host has no media-query API', () => {
    vi.stubGlobal('matchMedia', undefined);
    const view = render(<MotionStatus />);
    expect(screen.getByText('false')).toBeVisible();
    view.unmount();
    vi.unstubAllGlobals();
  });
});

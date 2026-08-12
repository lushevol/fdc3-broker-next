import { render, screen } from '@testing-library/react';
import React from 'react';
import { PortalExperience } from './index';

jest.mock('../LegacyExperience', () => ({
  __esModule: true,
  default: () => <div>Legacy experience</div>,
}));

jest.mock('./NewLayoutExperience', () => ({
  __esModule: true,
  default: () => <div>New layout experience</div>,
}));

describe('PortalExperience', () => {
  beforeEach(() => window.history.pushState({}, '', '/'));

  it('renders the legacy experience by default', () => {
    render(<PortalExperience version="test" />);

    expect(screen.getByText('Legacy experience')).toBeInTheDocument();
    expect(screen.queryByText('New layout experience')).not.toBeInTheDocument();
  });

  it('renders the new-layout experience only for new-layout=true', () => {
    window.history.pushState({}, '', '/?new-layout=true');
    render(<PortalExperience version="test" />);

    expect(screen.getByText('New layout experience')).toBeInTheDocument();
    expect(screen.queryByText('Legacy experience')).not.toBeInTheDocument();
  });
});

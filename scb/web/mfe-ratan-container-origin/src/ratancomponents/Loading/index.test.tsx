import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Loading } from './index';

describe('Loading component', () => {
  it('renders when loading is true', () => {
    render(<Loading loading={true} size={50} text="Loading..." />);
    const text = screen.getByText('Loading...');
    expect(text).toBeInTheDocument();
  });

  it('does not render when loading is false', () => {
    render(<Loading loading={false} size={50} text="Loading..." />);
    const text = screen.queryByText('Loading...');
    expect(text).not.toBeInTheDocument();
  });

});
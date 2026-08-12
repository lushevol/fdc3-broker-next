import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { InfoPop } from './index';

describe('InfoPop Component', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(
      <InfoPop 
        popDetail={[]} 
        details={{}} 
        detailItem={{ key: 'test' }} 
      />
    );
    expect(getByTestId('cashflow-counterparty-test')).toBeInTheDocument();
  });

  it('should show the info content when clicked', () => {
    const popDetail = [{ key: 'Key1', value: 'Value1' }];
    const details = { Value1: 'Detail1' };
    const { getByTestId, getByText } = render(
      <InfoPop 
        popDetail={popDetail} 
        details={details} 
        detailItem={{ key: 'test' }} 
      />
    );

    fireEvent.click(getByTestId('cashflow-counterparty-test'));
    expect(getByText('Key1')).toBeInTheDocument();
    expect(getByText('Detail1')).toBeInTheDocument();
  });
});

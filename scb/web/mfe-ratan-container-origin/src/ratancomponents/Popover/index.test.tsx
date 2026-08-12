import React from 'react';
import { render, screen } from '@testing-library/react';
import {PublicPopover} from "./index";


describe('PublicPopover', () => {
  it('renders correctly with popover enabled', () => {    
    render(
      <PublicPopover
        value="Test Value"
        name="Test Name"
        testId="public-popover-test"
        reverse = {true}
      />
    );

    const popoverName = screen.getByText('Test Name');
    expect(popoverName).toBeInTheDocument();

    const popoverValue = screen.getByText('Test Value');
    expect(popoverValue).toBeInTheDocument();

    const popoverBtn = screen.getByTestId('popover-btn');
    expect(popoverBtn).toBeInTheDocument();
  });

  it('renders correctly with popover details', () => {    
    render(
      <PublicPopover
        value="Test Value 2"
        name="Test Name"
        testId="public-popover-test"
        popoverEnable= {true}
        fieldsList= {[]}
        details={[]}
      />
    );

    const popoverValue = screen.getByText('Test Value 2');
    expect(popoverValue).toBeInTheDocument();

  });

  it('renders correctly with forceEnable', () => {    
    render(
      <PublicPopover
        value = "Test Value 3"
        forceEnable = {true}
        name="Test Name"
        testId="public-popover-test"
      />
    );

    const popoverValue = screen.getByText('Test Value 3');
    expect(popoverValue).toBeInTheDocument();

  });

});
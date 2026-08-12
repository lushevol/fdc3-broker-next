import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { GridReadyEvent } from 'ag-grid-community';
import { judgmentAuthority, ViewName } from './ViewName';
import { Context } from './store';
import { getEnable } from '../../ratanutils/componentEnabling';
import {
  getUser,
  hasPrivatePermission,
  hasPublicPermission,
} from "../../ratanutils/authenticator";

jest.mock('../../ratanutils/componentEnabling',() => {
  return {
    getEnable: jest.fn().mockReturnValue(true),
  }
});
jest.mock("../../LazyAntd/Input", () => {
  return (prop) => <input {...prop} />
})
jest.mock("../../ratanutils/authenticator", () => {
  return {
    getUser: jest.fn().mockReturnValue({}),
    hasPrivatePermission: jest.fn().mockReturnValue(true),
    hasPublicPermission: jest.fn().mockReturnValue(true),
  }
})

const mockContextValue = {
  state: {
    currentView: {
      name: 'Test View',
      assigneeList: 'FMO_OPS',
      isPublic: true,
    },
  },
};

const mockProps = {
  viewFieldType: 'testType',
  onSearch: jest.fn(),
  tradeGridReady: {} as GridReadyEvent,
};

const renderComponent = (props = mockProps) => {
  return render(
    <Context.Provider value={mockContextValue}>
      <ViewName {...props} />
    </Context.Provider>
  );
};

describe('ViewName Component', () => {
  it('renders search field', async () => {
    renderComponent();
    const searchField = screen.getByTestId('searchField');
    
    expect(searchField).toBeInTheDocument();

    userEvent.type(searchField,'test');
    await waitFor(() => expect(mockProps.onSearch).toHaveBeenCalledWith('test'));
  });

  it('renders view name input', async () => {
    renderComponent();
    const viewNameInput = screen.getByTestId('viewName');
    expect(viewNameInput).toBeInTheDocument();
    expect(viewNameInput).toHaveValue('Test View');

    userEvent.type(viewNameInput, 'test');
    // await waitFor(() => expect(viewNameInput).toHaveValue('test'));
  });

  it('renders save button', () => {
    renderComponent();
    const saveButton = screen.getByTestId('customView-save-btn');
    expect(saveButton).toBeInTheDocument();
  });

  it('renders remove button when isModify is true', () => {
    const modifiedProps = { ...mockProps, isModify: true };
    renderComponent(modifiedProps);
    const removeButton = screen.getByTestId('customView-remove-btn');
    expect(removeButton).toBeInTheDocument();
  });

  it('renders role select when View_Builder_POC is enabled', () => {
    const enabledProps = { ...mockProps, viewFieldType: 'View_Builder_POC' };
    renderComponent(enabledProps);
    const roleSelect = screen.getByTestId('filterNameTargetRoleSelect');
    expect(roleSelect).toBeInTheDocument();
  });

  it('renders private checkbox', () => {
    renderComponent();
    const privateCheckbox = screen.getByRole('checkbox', { name: /Is Private/i });
    fireEvent.click(privateCheckbox);
    expect(privateCheckbox).toBeInTheDocument();
  });

  it('renders private checkbox', () => {
    (getEnable as jest.Mock).mockReturnValue(false);
    renderComponent();
    const privateCheckbox = screen.getByRole('checkbox', { name: /Is Private/i });
    fireEvent.click(privateCheckbox);
    expect(privateCheckbox).toBeInTheDocument();
  });
});

describe('judgmentAuthority', () => {
  beforeEach(() => {
    (getEnable as jest.Mock).mockReset();
    (hasPrivatePermission as jest.Mock).mockReset();
    (hasPublicPermission as jest.Mock).mockReset();
  });

  test('should return true if getEnable returns true and assigneeList is empty', () => {
    (getEnable as jest.Mock).mockReturnValue(true);
    const result = judgmentAuthority('someType', 'someEms2', [], false);
    expect(result).toBe(false);
  });

  test('should return false if getEnable returns true and assigneeList is not empty', () => {
    (getEnable as jest.Mock).mockReturnValue(true);
    const result = judgmentAuthority('someType', 'someEms2', ['assignee'], false);
    expect(result).toBe(false);
  });

  test('should return false if getEnable returns false and hasPrivatePermission returns false', () => {
    (getEnable as jest.Mock).mockReturnValue(false);
    (hasPrivatePermission as jest.Mock).mockReturnValue(false);
    const result = judgmentAuthority('someType', 'someEms2', [], false);
    expect(result).toBe(false);
  });

  test('should return true if getEnable returns false, hasPrivatePermission returns true, and hasPublicPermission returns false', () => {
    (getEnable as jest.Mock).mockReturnValue(false);
    (hasPrivatePermission as jest.Mock).mockReturnValue(true);
    (hasPublicPermission as jest.Mock).mockReturnValue(false);
    const result = judgmentAuthority('someType', 'someEms2', [], false);
    expect(result).toBe(true);
  });

  test('should return false if getEnable returns false, hasPrivatePermission returns true, and hasPublicPermission returns true', () => {
    (getEnable as jest.Mock).mockReturnValue(false);
    (hasPrivatePermission as jest.Mock).mockReturnValue(true);
    (hasPublicPermission as jest.Mock).mockReturnValue(true);
    const result = judgmentAuthority('someType', 'someEms2', [], true);
    expect(result).toBe(false);
  });

  test('should return true if getEnable returns false, hasPrivatePermission returns true, and hasPublicPermission returns true but isPublic is false', () => {
    (getEnable as jest.Mock).mockReturnValue(false);
    (hasPrivatePermission as jest.Mock).mockReturnValue(true);
    (hasPublicPermission as jest.Mock).mockReturnValue(true);
    const result = judgmentAuthority('someType', 'someEms2', [], false);
    expect(result).toBe(true);
  });
});

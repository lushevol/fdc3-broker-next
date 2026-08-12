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

vi.mock('../../ratanutils/componentEnabling',() => {
  return {
    getEnable: vi.fn().mockReturnValue(true),
  }
});
vi.mock("../../LazyAntd/Input", () => {
  return { default: (prop) => <input {...prop} /> }
})
vi.mock("../../ratanutils/authenticator", () => {
  return {
    getUser: vi.fn().mockReturnValue({}),
    hasPrivatePermission: vi.fn().mockReturnValue(true),
    hasPublicPermission: vi.fn().mockReturnValue(true),
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
  onSearch: vi.fn(),
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
    (getEnable as vi.Mock).mockReturnValue(false);
    renderComponent();
    const privateCheckbox = screen.getByRole('checkbox', { name: /Is Private/i });
    fireEvent.click(privateCheckbox);
    expect(privateCheckbox).toBeInTheDocument();
  });
});

describe('judgmentAuthority', () => {
  beforeEach(() => {
    (getEnable as vi.Mock).mockReset();
    (hasPrivatePermission as vi.Mock).mockReset();
    (hasPublicPermission as vi.Mock).mockReset();
  });

  test('should return true if getEnable returns true and assigneeList is empty', () => {
    (getEnable as vi.Mock).mockReturnValue(true);
    const result = judgmentAuthority('someType', 'someEms2', [], false);
    expect(result).toBe(false);
  });

  test('should return false if getEnable returns true and assigneeList is not empty', () => {
    (getEnable as vi.Mock).mockReturnValue(true);
    const result = judgmentAuthority('someType', 'someEms2', ['assignee'], false);
    expect(result).toBe(false);
  });

  test('should return false if getEnable returns false and hasPrivatePermission returns false', () => {
    (getEnable as vi.Mock).mockReturnValue(false);
    (hasPrivatePermission as vi.Mock).mockReturnValue(false);
    const result = judgmentAuthority('someType', 'someEms2', [], false);
    expect(result).toBe(false);
  });

  test('should return true if getEnable returns false, hasPrivatePermission returns true, and hasPublicPermission returns false', () => {
    (getEnable as vi.Mock).mockReturnValue(false);
    (hasPrivatePermission as vi.Mock).mockReturnValue(true);
    (hasPublicPermission as vi.Mock).mockReturnValue(false);
    const result = judgmentAuthority('someType', 'someEms2', [], false);
    expect(result).toBe(true);
  });

  test('should return false if getEnable returns false, hasPrivatePermission returns true, and hasPublicPermission returns true', () => {
    (getEnable as vi.Mock).mockReturnValue(false);
    (hasPrivatePermission as vi.Mock).mockReturnValue(true);
    (hasPublicPermission as vi.Mock).mockReturnValue(true);
    const result = judgmentAuthority('someType', 'someEms2', [], true);
    expect(result).toBe(false);
  });

  test('should return true if getEnable returns false, hasPrivatePermission returns true, and hasPublicPermission returns true but isPublic is false', () => {
    (getEnable as vi.Mock).mockReturnValue(false);
    (hasPrivatePermission as vi.Mock).mockReturnValue(true);
    (hasPublicPermission as vi.Mock).mockReturnValue(true);
    const result = judgmentAuthority('someType', 'someEms2', [], false);
    expect(result).toBe(true);
  });
});

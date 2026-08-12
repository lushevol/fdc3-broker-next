import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SsiLists } from './SsiLists';
import { getQueryMultiSSI, getLookupSSI } from '../../../ratanutils/http/api';
import { DataGrid } from '../../../ratancomponents/DataGrid';

// 模拟依赖
jest.mock('../../../ratanutils/http/api', () => ({
  getQueryMultiSSI: jest.fn(() => Promise.resolve([])),
  getLookupSSI: jest.fn(),
}));

jest.mock('../../../ratancomponents/DataGrid', () => ({
  ...jest.requireActual('../../../ratancomponents/DataGrid'),
  DataGrid: jest.fn(() => <div data-testid="mock-data-grid" />),
  classes: {
    baseGrid: 'base-grid-class',
  },
}));

jest.mock('../../../ratancomponents/Loading', () => ({
  Loading: jest.fn(({ loading, text }) => (
    <div data-testid="mock-loading">{loading ? text : 'Not Loading'}</div>
  )),
}));

describe('SsiLists Component', () => {
  const mockOnClose = jest.fn();
  const mockOnOpenForm = jest.fn();
  const mockException = {
    data: {
      eventRowKey: 'event123',
      counterpartyFmLeid: 'fm123',
      settlementCurrency: 'USD',
      disableRightClick: false,
    },
  };

  const mockSsiData = [
    {
      ssiId: 'ssi1',
      fmid: 'fm123',
      tradingCurrency: 'USD',
      entity: 'Entity A',
      cfiCode: 'CODE1',
      customField: 'Custom Value',
      ssiField: 'SSI Value',
    },
    {
      ssiId: 'ssi2',
      fmid: 'fm456',
      tradingCurrency: 'EUR',
      entity: 'Entity B',
      cfiCode: 'CODE2',
      upstreamField: 'Upstream',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    expect(screen.getByTestId('mock-loading')).toHaveTextContent('loading...');
  });

  it('should fetch multi SSI data when isMultiSSI is true', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    expect(getQueryMultiSSI).toHaveBeenCalledWith('event123');
    
    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });
  });

  it('should fetch lookup SSI data when isMultiSSI is false', async () => {
    (getLookupSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={false}
        onOpenForm={mockOnOpenForm}
      />
    );

    expect(getLookupSSI).toHaveBeenCalledWith({
      fmid: 'fm123',
      tradingCurrency: 'USD',
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });
  });

  it('should handle API error and set empty options', async () => {
    (getQueryMultiSSI as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
      expect(DataGrid).toHaveBeenCalledWith(
        expect.objectContaining({
          rowData: [],
        }),
        expect.anything()
      );
    });
  });

  it('should not fetch data when dialog is not open', () => {
    render(
      <SsiLists
        open={false}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    expect(getQueryMultiSSI).not.toHaveBeenCalled();
    expect(getLookupSSI).not.toHaveBeenCalled();
  });

  it('should call onClose and reset options when dialog is closed', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    const { rerender } = render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });

    // 模拟关闭对话框
    const closeButton = screen.getByTestId('dialog-close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();

    // 重新渲染组件，验证options已被重置
    rerender(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    expect(screen.getByTestId('mock-loading')).toBeInTheDocument();
  });

  it('should generate correct column definitions', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(DataGrid).toHaveBeenCalledWith(
        expect.objectContaining({
          columnDefs: expect.arrayContaining([
            expect.objectContaining({ field: 'fmid', headerName: 'FM ID' }),
            expect.objectContaining({ field: 'tradingCurrency', headerName: 'Currency' }),
            expect.objectContaining({ field: 'entity', headerName: 'SCB Legal entity' }),
            expect.objectContaining({ field: 'ssiId', headerName: 'SSI ID' }),
            expect.objectContaining({ field: 'cfiCode', headerName: 'CFI Code' }),
            expect.objectContaining({ field: 'customField' }),
            expect.objectContaining({ field: 'ssiField', headerName: 'SSI Field' }),
          ]),
        }),
        expect.anything()
      );
    });
  });

  it('should handle row double click to open form', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });

    // 获取DataGrid的onRowDoubleClicked属性
    const dataGridProps = (DataGrid as jest.Mock).mock.calls[0][0];
    const onRowDoubleClicked = dataGridProps.onRowDoubleClicked;
    
    // 模拟双击行事件
    onRowDoubleClicked({ data: mockSsiData[0] });
    
    expect(mockOnOpenForm).toHaveBeenCalledWith(mockSsiData[0]);
  });

  it('should provide context menu items when right click is not disabled', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });

    // 获取DataGrid的getContextMenuItems属性
    const dataGridProps = (DataGrid as jest.Mock).mock.calls[0][0];
    const getContextMenuItems = dataGridProps.getContextMenuItems;
    
    // 模拟右键菜单事件
    const menuItems = getContextMenuItems({ data: mockSsiData[0] });
    
    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].name).toBe('Apply SSI');
    
    // 测试菜单项的action
    menuItems[0].action();
    expect(mockOnOpenForm).toHaveBeenCalledWith(mockSsiData[0]);
  });

  it('should not provide context menu items when right click is disabled', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={{
          data: {
            ...mockException.data,
            disableRightClick: true,
          },
        }}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });

    // 获取DataGrid的getContextMenuItems属性
    const dataGridProps = (DataGrid as jest.Mock).mock.calls[0][0];
    const getContextMenuItems = dataGridProps.getContextMenuItems;
    
    // 模拟右键菜单事件
    const menuItems = getContextMenuItems({ data: mockSsiData[0] });
    
    expect(menuItems).toHaveLength(0);
  });

  it('should fetch multi SSI data when isMultiSSI is true', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    expect(getQueryMultiSSI).toHaveBeenCalledWith('event123');
    
    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });
  });

  it('should fetch lookup SSI data when isMultiSSI is false', async () => {
    (getLookupSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={false}
        onOpenForm={mockOnOpenForm}
      />
    );

    expect(getLookupSSI).toHaveBeenCalledWith({
      fmid: 'fm123',
      tradingCurrency: 'USD',
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });
  });

  it('should handle API error and set empty options', async () => {
    (getQueryMultiSSI as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
      expect(DataGrid).toHaveBeenCalledWith(
        expect.objectContaining({
          rowData: [],
        }),
        expect.anything()
      );
    });
  });

  it('should not fetch data when dialog is not open', () => {
    render(
      <SsiLists
        open={false}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    expect(getQueryMultiSSI).not.toHaveBeenCalled();
    expect(getLookupSSI).not.toHaveBeenCalled();
  });

  it('should call onClose and reset options when dialog is closed', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    const { rerender } = render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });

    // 模拟关闭对话框
    const closeButton = screen.getByTestId('dialog-close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();

    // 重新渲染组件，验证options已被重置
    rerender(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    expect(screen.getByTestId('mock-loading')).toBeInTheDocument();
  });

  it('should generate correct column definitions', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(DataGrid).toHaveBeenCalledWith(
        expect.objectContaining({
          columnDefs: expect.arrayContaining([
            expect.objectContaining({ field: 'fmid', headerName: 'FM ID' }),
            expect.objectContaining({ field: 'tradingCurrency', headerName: 'Currency' }),
            expect.objectContaining({ field: 'entity', headerName: 'SCB Legal entity' }),
            expect.objectContaining({ field: 'ssiId', headerName: 'SSI ID' }),
            expect.objectContaining({ field: 'cfiCode', headerName: 'CFI Code' }),
            expect.objectContaining({ field: 'customField' }),
            expect.objectContaining({ field: 'ssiField', headerName: 'SSI Field' }),
          ]),
        }),
        expect.anything()
      );
    });
  });

  it('should handle row double click to open form', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });

    // 获取DataGrid的onRowDoubleClicked属性
    const dataGridProps = (DataGrid as jest.Mock).mock.calls[0][0];
    const onRowDoubleClicked = dataGridProps.onRowDoubleClicked;
    
    // 模拟双击行事件
    onRowDoubleClicked({ data: mockSsiData[0] });
    
    expect(mockOnOpenForm).toHaveBeenCalledWith(mockSsiData[0]);
  });

  it('should provide context menu items when right click is not disabled', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={mockException}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });

    // 获取DataGrid的getContextMenuItems属性
    const dataGridProps = (DataGrid as jest.Mock).mock.calls[0][0];
    const getContextMenuItems = dataGridProps.getContextMenuItems;
    
    // 模拟右键菜单事件
    const menuItems = getContextMenuItems({ data: mockSsiData[0] });
    
    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].name).toBe('Apply SSI');
    
    // 测试菜单项的action
    menuItems[0].action();
    expect(mockOnOpenForm).toHaveBeenCalledWith(mockSsiData[0]);
  });

  it('should not provide context menu items when right click is disabled', async () => {
    (getQueryMultiSSI as jest.Mock).mockResolvedValue(mockSsiData);

    render(
      <SsiLists
        open={true}
        onClose={mockOnClose}
        exception={{
          data: {
            ...mockException.data,
            disableRightClick: true,
          },
        }}
        isMultiSSI={true}
        onOpenForm={mockOnOpenForm}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('ssi-list')).toBeInTheDocument();
    });

    // 获取DataGrid的getContextMenuItems属性
    const dataGridProps = (DataGrid as jest.Mock).mock.calls[0][0];
    const getContextMenuItems = dataGridProps.getContextMenuItems;
    
    // 模拟右键菜单事件
    const menuItems = getContextMenuItems({ data: mockSsiData[0] });
    
    expect(menuItems).toHaveLength(0);
  });
});

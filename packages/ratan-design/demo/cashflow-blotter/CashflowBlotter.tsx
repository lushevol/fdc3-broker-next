import React, { useState, useCallback, useMemo } from 'react';
import {
  Layout,
  Typography,
  Button,
  Input,
  Select,
  DatePicker,
  Card,
  Badge,
  Table,
  Space,
  Divider,
  Alert,
  Switch,
  Avatar,
  Tabs,
  Row,
  Col,
  Form,
  Tag,
  Tooltip,
  ConfigProvider,
  theme,
} from 'antd';
import type { TableColumnsType } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  ApiOutlined,
  DownOutlined,
  UpOutlined,
  SettingOutlined,
  FileExcelOutlined,
  ColumnWidthOutlined,
  InfoCircleOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  MessageOutlined,
  CloseOutlined,
  FilterOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import './styles.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Types
interface CashflowRecord {
  key: string;
  cashflowId: string;
  cashflowVersion: string;
  cashflowMajorVersion: number;
  cashflowMinorVersion: number;
  cashflowAffirmationStatus: string;
  cashflowSubStateType: string;
  tradeId: string;
  valueDate: string;
  currency: string;
  amount: number;
  cashflowType: string;
  cashflowStatus: string;
  settlementMethod: string;
  counterparty: string;
  productTaxonomy: string;
  nstpException: string;
  bookingEntity: string;
}

interface PresetQuery {
  label: string;
  count: number;
  type: 'warning' | 'primary' | 'success';
}

// Mock Data
const generateMockData = (): CashflowRecord[] => {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];
  const counterparties = [
    'Bank of America',
    'Deutsche Bank',
    'HSBC',
    'JP Morgan',
    'Barclays',
    'Citigroup',
    'Morgan Stanley',
  ];
  const statuses = [
    'Pending Operator',
    'Pending Verification',
    'Completed',
    'Failed',
  ];
  const types = ['Payment', 'Receipt'];
  const products = ['FX Spot', 'FX Forward', 'Money Market', 'Securities'];

  return Array.from({ length: 24 }, (_, i) => ({
    key: `cf-${i}`,
    cashflowId: `CF-2026-${String(i + 1).padStart(3, '0')}`,
    cashflowVersion: '1.0',
    cashflowMajorVersion: 1,
    cashflowMinorVersion: 0,
    cashflowAffirmationStatus: i % 3 === 0 ? 'Affirmed' : 'Unaffirmed',
    cashflowSubStateType: statuses[i % statuses.length],
    tradeId: `TD-2026-${String(i + 1).padStart(4, '0')}`,
    valueDate: format(new Date(2026, 2, 8 + Math.floor(i / 3)), 'dd MMM yyyy'),
    currency: currencies[i % currencies.length],
    amount: Math.floor(Math.random() * 10000000) / 100,
    cashflowType: types[i % types.length],
    cashflowStatus: statuses[i % statuses.length],
    settlementMethod: i % 2 === 0 ? 'SWIFT' : 'RTGS',
    counterparty: counterparties[i % counterparties.length],
    productTaxonomy: products[i % products.length],
    nstpException: i % 5 === 0 ? 'Exception' : 'Normal',
    bookingEntity: ['London', 'New York', 'Singapore', 'Hong Kong'][i % 4],
  }));
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Pending Operator':
        return { color: '#faad14', bg: '#fffbe6', border: '#ffe58f' };
      case 'Pending Verification':
        return { color: '#1677ff', bg: '#e6f4ff', border: '#91caff' };
      case 'Completed':
        return { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f' };
      case 'Failed':
        return { color: '#ff4d4f', bg: '#fff2f0', border: '#ffccc7' };
      default:
        return { color: '#8c8c8c', bg: '#f5f5f5', border: '#d9d9d9' };
    }
  };

  const colors = getStatusColor(status);

  return (
    <span
      className="status-badge"
      style={{
        color: colors.color,
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      {status}
    </span>
  );
};

// Preset Query Button
const PresetQueryButton: React.FC<{
  query: PresetQuery;
  onClick: () => void;
}> = ({ query, onClick }) => (
  <button className="preset-query-btn" onClick={onClick}>
    <span className="preset-query-label">{query.label}</span>
    <span
      className={`preset-query-count ${query.type}`}
      style={{
        backgroundColor:
          query.type === 'warning'
            ? '#faad14'
            : query.type === 'success'
              ? '#52c41a'
              : '#1677ff',
        color: query.type === 'warning' ? '#000' : '#fff',
      }}
    >
      {query.count}
    </span>
  </button>
);

// Main Component
const CashflowBlotter: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CashflowRecord[]>(generateMockData());

  // Form states
  const [cashflowId, setCashflowId] = useState('');
  const [tradeId, setTradeId] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [currency, setCurrency] = useState<string>();
  const [productTaxonomy, setProductTaxonomy] = useState<string[]>();
  const [counterparty, setCounterparty] = useState('');
  const [bookingEntity, setBookingEntity] = useState<string>();
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [amountRange, setAmountRange] = useState<number>();

  // Quick filter states
  const [valueDateHorizon, setValueDateHorizon] = useState<string>();
  const [quickProductTaxonomy, setQuickProductTaxonomy] = useState<string>();
  const [nstpException, setNstpException] = useState<string>();
  const [quickBookingEntity, setQuickBookingEntity] = useState<string>();
  const [quickCashflowStatus, setQuickCashflowStatus] = useState<string>();

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 800);
  }, []);

  const handleSearch = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleClearFilters = useCallback(() => {
    setCashflowId('');
    setTradeId('');
    setDateRange(null);
    setCurrency(undefined);
    setProductTaxonomy(undefined);
    setCounterparty('');
    setBookingEntity(undefined);
    setBeneficiaryName('');
    setAmountRange(undefined);
  }, []);

  const columns: TableColumnsType<CashflowRecord> = useMemo(
    () => [
      {
        title: 'Cashflow ID',
        dataIndex: 'cashflowId',
        key: 'cashflowId',
        width: 140,
        sorter: (a, b) => a.cashflowId.localeCompare(b.cashflowId),
        fixed: 'left',
        render: (text) => <span className="cell-highlight">{text}</span>,
      },
      {
        title: 'Trade ID',
        dataIndex: 'tradeId',
        key: 'tradeId',
        width: 130,
        sorter: (a, b) => a.tradeId.localeCompare(b.tradeId),
      },
      {
        title: 'Value Date',
        dataIndex: 'valueDate',
        key: 'valueDate',
        width: 120,
        sorter: (a, b) =>
          new Date(a.valueDate).getTime() - new Date(b.valueDate).getTime(),
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        width: 90,
        align: 'center',
        render: (text) => <span className="currency-badge">{text}</span>,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 130,
        align: 'right',
        sorter: (a, b) => a.amount - b.amount,
        render: (amount, record) => (
          <span
            className={`amount-cell ${record.cashflowType === 'Payment' ? 'negative' : 'positive'}`}
          >
            {record.cashflowType === 'Payment' ? '-' : '+'}
            {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'cashflowType',
        key: 'cashflowType',
        width: 100,
        render: (type) => (
          <Tag className={`type-tag ${type.toLowerCase()}`}>{type}</Tag>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'cashflowStatus',
        key: 'cashflowStatus',
        width: 150,
        filters: [
          { text: 'Pending Operator', value: 'Pending Operator' },
          { text: 'Pending Verification', value: 'Pending Verification' },
          { text: 'Completed', value: 'Completed' },
          { text: 'Failed', value: 'Failed' },
        ],
        onFilter: (value, record) => record.cashflowStatus === value,
        render: (status) => <StatusBadge status={status} />,
      },
      {
        title: 'Settlement',
        dataIndex: 'settlementMethod',
        key: 'settlementMethod',
        width: 100,
        align: 'center',
      },
      {
        title: 'Counterparty',
        dataIndex: 'counterparty',
        key: 'counterparty',
        width: 150,
        ellipsis: true,
      },
      {
        title: 'Product',
        dataIndex: 'productTaxonomy',
        key: 'productTaxonomy',
        width: 120,
      },
      {
        title: 'Booking Entity',
        dataIndex: 'bookingEntity',
        key: 'bookingEntity',
        width: 130,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 100,
        fixed: 'right',
        render: () => (
          <Space size="small">
            <Tooltip title="View Details">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                className="action-btn"
              />
            </Tooltip>
            <Tooltip title="Download">
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                className="action-btn"
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [],
  );

  const hasFilters =
    cashflowId ||
    tradeId ||
    dateRange ||
    currency ||
    productTaxonomy?.length ||
    counterparty ||
    bookingEntity ||
    beneficiaryName ||
    amountRange;

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const presetQueries: { title: string; queries: PresetQuery[] }[] = [
    {
      title: 'Value Today',
      queries: [
        { label: 'Pending Operator', count: 1, type: 'warning' },
        { label: 'Pending Verification', count: 0, type: 'primary' },
      ],
    },
    {
      title: 'Value till Monday',
      queries: [
        { label: 'Pending Operator', count: 21, type: 'warning' },
        { label: 'Pending Verification', count: 0, type: 'primary' },
      ],
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0473ea',
          colorInfo: '#0473ea',
          borderRadius: 6,
          colorBgContainer: darkMode ? '#1a1a1a' : '#ffffff',
          colorBgLayout: darkMode ? '#0d0d0d' : '#f7f9fd',
        },
      }}
    >
      <Layout className={`cashflow-blotter ${darkMode ? 'dark' : 'light'}`}>
        {/* App Header */}
        <Header className="app-header">
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="4"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M7 12h10M7 8h6M7 16h8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <Title level={4} className="app-title">
                FMO Post Trade Portal
              </Title>
            </div>
          </div>

          <div className="header-right">
            <Button type="text" className="header-btn" icon={<PlusOutlined />}>
              New Tile
            </Button>

            <Divider type="vertical" className="header-divider" />

            <div className="theme-toggle">
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
              <Text className="theme-label">{darkMode ? 'dark' : 'light'}</Text>
            </div>

            <Divider type="vertical" className="header-divider" />

            <div className="time-display">
              <Text className="utc-time">
                {format(new Date(), 'HH:mm')} UTC
              </Text>
            </div>

            <Divider type="vertical" className="header-divider" />

            <Tooltip title="User Profile">
              <Avatar className="user-avatar" icon={<UserOutlined />}>
                A
              </Avatar>
            </Tooltip>

            <Tooltip title="Share Feedback">
              <Button
                type="text"
                className="header-btn feedback-btn"
                icon={<MessageOutlined />}
              />
            </Tooltip>
          </div>
        </Header>

        {/* Workspace Tabs */}
        <div className="workspace-tabs">
          <Tabs
            type="editable-card"
            defaultActiveKey="1"
            items={[{ key: '1', label: 'Cashflow Blotter', closable: false }]}
            addIcon={<PlusOutlined />}
          />
        </div>

        {/* Main Content */}
        <Content className="main-content">
          {/* Page Header */}
          <div className="page-header">
            <div className="version-info">
              <Tag className="version-tag">
                Version: 1.40.0-v1.40.0-20260227.4
              </Tag>
              <Tag className="env-tag">Env: UAT</Tag>
            </div>
            <Space>
              <Button icon={<ApiOutlined />} className="header-action-btn">
                API Status
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                className="header-action-btn"
              >
                Refresh Page
              </Button>
            </Space>
          </div>

          {/* Search Section */}
          {searchExpanded && (
            <div className="search-section-wrapper">
              <div className="search-panels">
                {/* Quick Search Panel */}
                <Card
                  className="search-panel quick-search"
                  title="Quick Search"
                >
                  <Form
                    layout="horizontal"
                    labelAlign="right"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                  >
                    <Row gutter={[16, 12]}>
                      <Col span={12}>
                        <Form.Item label="Cashflow ID">
                          <Input
                            placeholder="Multiple searches separated by commas"
                            value={cashflowId}
                            onChange={(e) => setCashflowId(e.target.value)}
                            allowClear
                            suffix={<SearchOutlined />}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Trade ID">
                          <Input
                            placeholder="Enter trade ID"
                            value={tradeId}
                            onChange={(e) => setTradeId(e.target.value)}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Value Date Range">
                          <RangePicker
                            style={{ width: '100%' }}
                            format="DD MMM YYYY"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Currency">
                          <Select
                            placeholder="Select..."
                            value={currency}
                            onChange={setCurrency}
                            allowClear
                            options={[
                              { value: 'USD', label: 'USD - US Dollar' },
                              { value: 'EUR', label: 'EUR - Euro' },
                              { value: 'GBP', label: 'GBP - British Pound' },
                              { value: 'JPY', label: 'JPY - Japanese Yen' },
                              { value: 'CHF', label: 'CHF - Swiss Franc' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Product Taxonomy">
                          <Select
                            mode="multiple"
                            placeholder="Select..."
                            value={productTaxonomy}
                            onChange={setProductTaxonomy}
                            options={[
                              { value: 'FX', label: 'FX' },
                              { value: 'MM', label: 'Money Market' },
                              { value: 'SECURITIES', label: 'Securities' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Counterparty FMCODE">
                          <Input
                            placeholder="Multiple searches separated by commas"
                            value={counterparty}
                            onChange={(e) => setCounterparty(e.target.value)}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="SCB Booking Entity">
                          <Select
                            placeholder="Select..."
                            value={bookingEntity}
                            onChange={setBookingEntity}
                            allowClear
                            options={[
                              { value: 'London', label: 'London' },
                              { value: 'New York', label: 'New York' },
                              { value: 'Singapore', label: 'Singapore' },
                              { value: 'Hong Kong', label: 'Hong Kong' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Beneficiary Name">
                          <Input
                            placeholder="Enter beneficiary name"
                            value={beneficiaryName}
                            onChange={(e) => setBeneficiaryName(e.target.value)}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className="search-actions">
                      <Button
                        onClick={handleClearFilters}
                        disabled={!hasFilters}
                        className="clear-btn"
                      >
                        Clear Filters
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleSearch}
                        disabled={!hasFilters}
                        icon={<SearchOutlined />}
                        className="search-btn"
                      >
                        Search
                      </Button>
                    </div>
                  </Form>
                </Card>

                {/* Preset Queries */}
                <div className="preset-queries">
                  {presetQueries.map((section) => (
                    <Card
                      key={section.title}
                      className="preset-card"
                      title={section.title}
                    >
                      <div className="preset-list">
                        {section.queries.map((query) => (
                          <PresetQueryButton
                            key={query.label}
                            query={query}
                            onClick={() => {}}
                          />
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Custom Search/View */}
                <Card
                  className="search-panel custom-search"
                  title="Custom Search/View"
                >
                  <div className="custom-field-row">
                    <div className="custom-field">
                      <Text className="field-label">Filters</Text>
                      <Select
                        placeholder="Select..."
                        style={{ width: '100%' }}
                      />
                    </div>
                    <Space className="custom-actions">
                      <Button disabled>Clear</Button>
                      <Button type="primary">Create or Modify</Button>
                    </Space>
                  </div>
                  <div className="custom-field-row">
                    <div className="custom-field">
                      <Text className="field-label">Views</Text>
                      <Select
                        placeholder="Select..."
                        style={{ width: '100%' }}
                      />
                    </div>
                    <Space className="custom-actions">
                      <Button disabled>Clear</Button>
                      <Button type="primary">Create or Modify</Button>
                    </Space>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Hide Search Bar Toggle */}
          <div className="search-toggle">
            <Button
              type="text"
              onClick={() => setSearchExpanded(!searchExpanded)}
              icon={searchExpanded ? <UpOutlined /> : <DownOutlined />}
            >
              {searchExpanded ? 'Hide Search Bar' : 'Show Search Bar'}
            </Button>
          </div>

          {/* Quick Filters Bar */}
          <div className="quick-filters-bar">
            <Select
              className="quick-filter"
              placeholder="Value Date Horizon"
              value={valueDateHorizon}
              onChange={setValueDateHorizon}
              allowClear
              options={[
                { value: 'TODAY', label: 'Today' },
                { value: 'WEEK', label: 'This Week' },
                { value: 'MONTH', label: 'This Month' },
              ]}
            />
            <Select
              className="quick-filter"
              placeholder="Product Taxonomy"
              value={quickProductTaxonomy}
              onChange={setQuickProductTaxonomy}
              allowClear
              options={[
                { value: 'FX', label: 'FX' },
                { value: 'MM', label: 'Money Market' },
                { value: 'SECURITIES', label: 'Securities' },
              ]}
            />
            <Select
              className="quick-filter"
              placeholder="NSTP Exception"
              value={nstpException}
              onChange={setNstpException}
              allowClear
              options={[
                { value: 'NORMAL', label: 'Normal' },
                { value: 'EXCEPTION', label: 'Exception' },
              ]}
            />
            <Select
              className="quick-filter"
              placeholder="Booking Entity"
              value={quickBookingEntity}
              onChange={setQuickBookingEntity}
              allowClear
              options={[
                { value: 'London', label: 'London' },
                { value: 'New York', label: 'New York' },
                { value: 'Singapore', label: 'Singapore' },
              ]}
            />
            <Select
              className="quick-filter"
              placeholder="Cashflow Status"
              value={quickCashflowStatus}
              onChange={setQuickCashflowStatus}
              allowClear
              options={[
                { value: 'PENDING_OPERATOR', label: 'Pending Operator' },
                {
                  value: 'PENDING_VERIFICATION',
                  label: 'Pending Verification',
                },
                { value: 'COMPLETED', label: 'Completed' },
              ]}
            />
          </div>

          {/* Alert Banner */}
          <Alert
            className="data-alert"
            message="If more than 1000 records are loaded, column filters below will be applied only within the first 1000 records."
            type="info"
            showIcon
            closable
            icon={<InfoCircleOutlined />}
          />

          {/* Data Grid */}
          <Card className="data-grid-card" bodyStyle={{ padding: 0 }}>
            <Table<CashflowRecord>
              columns={columns}
              dataSource={data}
              rowSelection={rowSelection}
              loading={loading}
              scroll={{ x: 1500, y: 400 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              size="small"
              className="cashflow-table"
            />
          </Card>

          {/* Grid Footer */}
          <div className="grid-footer">
            <div className="footer-left">
              <Text className="results-label">Results</Text>
              <Badge
                count={selectedRowKeys.length}
                className="selection-badge"
                overflowCount={999}
              >
                <Text className="results-count">
                  {selectedRowKeys.length > 0
                    ? `${selectedRowKeys.length} selected / `
                    : ''}
                  {data.length} total
                </Text>
              </Badge>
            </div>

            <Divider type="vertical" />

            <Space className="footer-actions">
              <Button icon={<ColumnWidthOutlined />} className="footer-btn">
                Resize
              </Button>
              <Button icon={<FileExcelOutlined />} className="footer-btn">
                Export File
              </Button>
              <Button icon={<SettingOutlined />} className="footer-btn" />
            </Space>

            <Divider type="vertical" />

            <Text className="last-updated">
              <InfoCircleOutlined /> Last updated:{' '}
              {format(new Date(), 'd MMM yyyy, HH:mm:ss')} UTC
            </Text>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default CashflowBlotter;

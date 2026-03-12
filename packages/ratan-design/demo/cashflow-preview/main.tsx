import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import {
  Search,
  Plus,
  RefreshCw,
  Activity,
  ChevronDown,
  ChevronUp,
  Settings,
  FileSpreadsheet,
  Columns,
  Info,
  Sun,
  Moon,
  MessageSquare,
  Eye,
  Download,
  Check,
  Clock,
  ArrowUpDown,
  MoreHorizontal,
  LayoutGrid,
  Zap,
  X,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

// Types
interface CashflowRecord {
  id: string;
  cashflowId: string;
  cashflowVersion: string;
  tradeId: string;
  valueDate: string;
  currency: string;
  amount: number;
  cashflowType: 'Payment' | 'Receipt';
  cashflowStatus:
    | 'Pending Operator'
    | 'Pending Verification'
    | 'Completed'
    | 'Failed';
  settlementMethod: string;
  counterparty: string;
  productTaxonomy: string;
  nstpException: 'Normal' | 'Exception';
  bookingEntity: string;
  affirmationStatus: 'Affirmed' | 'Unaffirmed';
}

interface StatMetric {
  label: string;
  count: number;
  type: 'warning' | 'primary' | 'success';
}

interface StatGroup {
  title: string;
  metrics: StatMetric[];
}

// Mock Data Generator
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
    'Goldman Sachs',
  ];
  const statuses: CashflowRecord['cashflowStatus'][] = [
    'Pending Operator',
    'Pending Verification',
    'Completed',
    'Failed',
  ];
  const types: CashflowRecord['cashflowType'][] = ['Payment', 'Receipt'];
  const products = [
    'FX Spot',
    'FX Forward',
    'Money Market',
    'Securities',
    'Derivatives',
  ];
  const entities = ['London', 'New York', 'Singapore', 'Hong Kong', 'Tokyo'];

  return Array.from({ length: 50 }, (_, i) => {
    const type = types[i % types.length];
    const amount = Math.floor(Math.random() * 50000000) / 100;
    return {
      id: `cf-${i}`,
      cashflowId: `CF-${2026}${String(i + 1).padStart(5, '0')}`,
      cashflowVersion: '1.0',
      tradeId: `TD-${2026}-${String(1000 + i).padStart(5, '0')}`,
      valueDate: format(
        new Date(2026, 2, 8 + Math.floor(i / 5)),
        'dd MMM yyyy',
      ),
      currency: currencies[i % currencies.length],
      amount: type === 'Payment' ? -amount : amount,
      cashflowType: type,
      cashflowStatus: statuses[i % statuses.length],
      settlementMethod: i % 2 === 0 ? 'SWIFT' : 'RTGS',
      counterparty: counterparties[i % counterparties.length],
      productTaxonomy: products[i % products.length],
      nstpException: i % 5 === 0 ? 'Exception' : 'Normal',
      bookingEntity: entities[i % entities.length],
      affirmationStatus: i % 3 === 0 ? 'Affirmed' : 'Unaffirmed',
    };
  });
};

// UI Components
const Button: React.FC<{
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}> = ({
  children,
  variant = 'secondary',
  size = 'md',
  disabled,
  onClick,
  className = '',
  icon,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/50';

  const variants = {
    primary:
      'bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/20',
    secondary:
      'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-900 dark:text-slate-200 border border-gray-300 dark:border-slate-700',
    ghost: 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200',
    danger:
      'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
    >
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
    </button>
  );
};

const Input: React.FC<{
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
  type?: string;
}> = ({ placeholder, value, onChange, className = '', icon, type = 'text' }) => (
  <div className={`relative focus-ring rounded-md ${className}`}>
    {icon && (
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
        {icon}
      </div>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all ${
        icon ? 'pl-9 pr-3 py-1.5' : 'px-3 py-1.5'
      }`}
    />
  </div>
);

const Select: React.FC<{
  placeholder?: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}> = ({ placeholder, value, options, onChange, className = '' }) => (
  <div className={`relative focus-ring rounded-md ${className}`}>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-slate-200 text-sm px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all cursor-pointer"
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500 pointer-events-none" />
  </div>
);

const MultiSelect: React.FC<{
  placeholder?: string;
  values: string[];
  options: { value: string; label: string }[];
  onChange: (values: string[]) => void;
  className?: string;
}> = ({ placeholder, values, options, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const removeValue = (value: string) => {
    onChange(values.filter((v) => v !== value));
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[34px] bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-md px-3 py-1.5 cursor-pointer focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
      >
        {values.length === 0 ? (
          <span className="text-sm text-gray-500 dark:text-slate-500">{placeholder || 'Select...'}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {values.map((v) => {
              const label = options.find((o) => o.value === v)?.label || v;
              return (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded"
                >
                  {label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(v);
                    }}
                    className="hover:text-primary-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg max-h-48 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleValue(opt.value)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 ${
                values.includes(opt.value) ? 'text-primary-400' : 'text-gray-700 dark:text-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  values.includes(opt.value)
                    ? 'bg-primary-600 border-primary-500'
                    : 'border-slate-600'
                }`}
              >
                {values.includes(opt.value) && <Check className="w-3 h-3 text-white" />}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DateRangePicker: React.FC<{
  startDate?: string;
  endDate?: string;
  onChange: (start: string, end: string) => void;
  className?: string;
}> = ({ startDate = '', endDate = '', onChange, className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative flex-1">
      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
      <input
        type="text"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => onChange(e.target.value, endDate)}
        className="w-full bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 text-sm pl-9 pr-3 py-1.5 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
      />
    </div>
    <span className="text-gray-400 dark:text-slate-500">-</span>
    <div className="relative flex-1">
      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
      <input
        type="text"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => onChange(startDate, e.target.value)}
        className="w-full bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-md text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 text-sm pl-9 pr-3 py-1.5 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
      />
    </div>
  </div>
);

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700',
    success:
      'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning:
      'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
    info: 'bg-primary-500/15 text-primary-400 border-primary-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const StatusIndicator: React.FC<{
  status: CashflowRecord['cashflowStatus'];
}> = ({ status }) => {
  const config = {
    'Pending Operator': {
      color: 'bg-amber-500',
      variant: 'warning' as const,
    },
    'Pending Verification': {
      color: 'bg-primary-500',
      variant: 'info' as const,
    },
    Completed: { color: 'bg-emerald-500', variant: 'success' as const },
    Failed: { color: 'bg-red-500', variant: 'danger' as const },
  };

  const { color, variant } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      {status}
    </Badge>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  headerAction?: React.ReactNode;
}> = ({ children, className = '', title, headerAction }) => (
  <div className={`bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm dark:shadow-none ${className}`}>
    {(title || headerAction) && (
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
        {title && (
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-200">{title}</h3>
        )}
        {headerAction}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center ${
      checked
        ? 'bg-primary-600 border-primary-500'
        : 'bg-white dark:bg-slate-900/50 border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
    }`}
  >
    {checked && <Check className="w-3 h-3 text-white" />}
  </button>
);

// Dropdown Component
const WorkspaceDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  lastUpdated: Date;
}> = ({ isOpen, onClose, onRefresh, lastUpdated }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-fade-in"
    >
      <div className="p-3 space-y-2">
        {/* Environment */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-slate-400">Environment</span>
          <Badge variant="success" className="text-xs">UAT</Badge>
        </div>

        {/* Version */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-slate-400">Version</span>
          <span className="text-xs text-gray-700 dark:text-slate-300 font-mono">1.40.0</span>
        </div>

        {/* API Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-slate-400">API Status</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400">Online</span>
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-slate-800 my-2" />

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
          <span className="text-xs text-gray-700 dark:text-slate-300">Refresh Page</span>
        </button>

        {/* Last Updated */}
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 dark:text-slate-500">
          <Clock className="w-3 h-3" />
          <span>Updated: {format(lastUpdated, 'HH:mm:ss')}</span>
        </div>
      </div>
    </div>
  );
};

// Statistics Bar Component
const StatisticsBar: React.FC<{
  statGroups: StatGroup[];
  onMetricClick: (metric: StatMetric) => void;
}> = ({ statGroups, onMetricClick }) => (
  <div className="flex flex-wrap items-center gap-6 p-3 rounded-lg bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-none">
    {statGroups.map((group) => (
      <div key={group.title} className="flex items-center gap-3">
        <span className="text-xs text-gray-500 dark:text-slate-500 font-medium">{group.title}:</span>
        <div className="flex items-center gap-2">
          {group.metrics.map((metric) => (
            <button
              key={metric.label}
              onClick={() => onMetricClick(metric)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors group"
            >
              <span className="text-xs text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300">
                {metric.label}
              </span>
              <Badge
                variant={
                  metric.type === 'warning'
                    ? 'warning'
                    : metric.type === 'success'
                    ? 'success'
                    : 'info'
                }
                className="text-xs"
              >
                {metric.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Custom Search/View Panel Component
const CustomSearchViewPanel: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedView, setSelectedView] = useState('');

  const savedFilters = [
    { value: 'filter1', label: 'High Priority Items' },
    { value: 'filter2', label: 'Today Pending' },
    { value: 'filter3', label: 'Failed Transactions' },
  ];

  const savedViews = [
    { value: 'view1', label: 'Default View' },
    { value: 'view2', label: 'Operations View' },
    { value: 'view3', label: 'Audit View' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-none">
      {/* Filters Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-slate-500 uppercase font-medium w-14">Filters</span>
          <Select
            placeholder="Select..."
            value={selectedFilter}
            options={savedFilters}
            onChange={setSelectedFilter}
            className="flex-1"
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={!selectedFilter}
            onClick={() => setSelectedFilter('')}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => console.log('Create/Modify Filter')}
          >
            Create or Modify
          </Button>
        </div>
      </div>

      {/* Views Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-slate-500 uppercase font-medium w-14">Views</span>
          <Select
            placeholder="Select..."
            value={selectedView}
            options={savedViews}
            onChange={setSelectedView}
            className="flex-1"
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={!selectedView}
            onClick={() => setSelectedView('')}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => console.log('Create/Modify View')}
          >
            Create or Modify
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Application
const CashflowBlotterPreview: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchExpanded, setSearchExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [data, setData] = useState<CashflowRecord[]>(generateMockData());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Quick Search form states - all 10 fields
  const [filters, setFilters] = useState({
    cashflowId: '',
    tradeId: '',
    valueDateStart: '',
    valueDateEnd: '',
    currency: '',
    productTaxonomy: [] as string[],
    counterpartyFmcode: '',
    bookingEntity: '',
    beneficiaryName: '',
    beneficiaryBic: '',
    amountRange: '',
  });

  const handleRefresh = useCallback(() => {
    setData(generateMockData());
    setLastUpdated(new Date());
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      cashflowId: '',
      tradeId: '',
      valueDateStart: '',
      valueDateEnd: '',
      currency: '',
      productTaxonomy: [],
      counterpartyFmcode: '',
      bookingEntity: '',
      beneficiaryName: '',
      beneficiaryBic: '',
      amountRange: '',
    });
  }, []);

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAllRows = useCallback(() => {
    setSelectedRows((prev) => {
      if (prev.size === data.length) {
        return new Set();
      }
      return new Set(data.map((d) => d.id));
    });
  }, [data]);

  const hasFilters =
    filters.cashflowId ||
    filters.tradeId ||
    filters.valueDateStart ||
    filters.valueDateEnd ||
    filters.currency ||
    filters.productTaxonomy.length > 0 ||
    filters.counterpartyFmcode ||
    filters.bookingEntity ||
    filters.beneficiaryName ||
    filters.beneficiaryBic ||
    filters.amountRange;

  const statGroups: StatGroup[] = [
    {
      title: 'Value Today',
      metrics: [
        { label: 'Pending Operator', count: 12, type: 'warning' },
        { label: 'Pending Verification', count: 5, type: 'primary' },
      ],
    },
    {
      title: 'Value till Monday',
      metrics: [
        { label: 'Pending Operator', count: 48, type: 'warning' },
        { label: 'Pending Verification', count: 23, type: 'primary' },
      ],
    },
  ];

  const handleMetricClick = useCallback((metric: StatMetric) => {
    console.log('Clicked metric:', metric);
  }, []);

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const sign = amount >= 0 ? '+' : '-';
    const colorClass = amount >= 0 ? 'text-emerald-400' : 'text-red-400';
    return { formatted, sign, colorClass };
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header - Simplified */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">
              FMO Post Trade Portal
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              New Tile
            </Button>

            <div className="h-5 w-px bg-slate-700" />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-slate-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <div className="h-5 w-px bg-slate-700" />

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
              <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
              <span className="text-xs font-mono text-gray-700 dark:text-slate-300">
                {format(new Date(), 'HH:mm')}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-500">UTC</span>
            </div>

            <div className="h-5 w-px bg-slate-700" />

            <button className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-medium shadow-lg shadow-primary-500/20">
              A
            </button>

            <Button variant="ghost" size="sm" icon={<MessageSquare className="w-3.5 h-3.5" />}>
              Feedback
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Seamless with Workspace Tab */}
      <main className="pt-14">
        {/* Workspace Tab Bar - Seamless */}
        <div className="bg-slate-950 border-b border-slate-800/50">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-md border border-primary-500/30 text-sm font-medium hover:bg-primary-500/20 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Cashflow Blotter
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <WorkspaceDropdown
                  isOpen={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  onRefresh={handleRefresh}
                  lastUpdated={lastUpdated}
                />
              </div>
              <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Environment/Status indicators in tab bar */}
            <div className="flex items-center gap-3">
              <Badge variant="success" className="text-xs">UAT</Badge>
              <span className="text-xs text-gray-500 dark:text-slate-500">v1.40.0</span>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 py-4">
          {/* Quick Search Panel - All 10 Fields */}
          {searchExpanded && (
            <Card
              title="Quick Search"
              headerAction={
                <button
                  onClick={() => setSearchExpanded(false)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors text-xs"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  Hide
                </button>
              }
              className="mb-4"
            >
              <div className="grid grid-cols-5 gap-3">
                {/* Row 1 */}
                <Input
                  placeholder="Cashflow ID"
                  value={filters.cashflowId}
                  onChange={(v) => setFilters((f) => ({ ...f, cashflowId: v }))}
                />
                <div className="relative">
                  <Input
                    placeholder="Trade ID"
                    value={filters.tradeId}
                    onChange={(v) => setFilters((f) => ({ ...f, tradeId: v }))}
                    className="pr-16"
                  />
                  <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 bg-gray-100 dark:bg-slate-800 rounded">
                    ID ▼
                  </button>
                </div>
                <DateRangePicker
                  startDate={filters.valueDateStart}
                  endDate={filters.valueDateEnd}
                  onChange={(start, end) =>
                    setFilters((f) => ({ ...f, valueDateStart: start, valueDateEnd: end }))
                  }
                />
                <Select
                  placeholder="Currency"
                  value={filters.currency}
                  options={[
                    { value: 'USD', label: 'USD - US Dollar' },
                    { value: 'EUR', label: 'EUR - Euro' },
                    { value: 'GBP', label: 'GBP - British Pound' },
                    { value: 'JPY', label: 'JPY - Japanese Yen' },
                    { value: 'CHF', label: 'CHF - Swiss Franc' },
                    { value: 'CAD', label: 'CAD - Canadian Dollar' },
                    { value: 'AUD', label: 'AUD - Australian Dollar' },
                  ]}
                  onChange={(v) => setFilters((f) => ({ ...f, currency: v }))}
                />
                <MultiSelect
                  placeholder="Product Taxonomy"
                  values={filters.productTaxonomy}
                  options={[
                    { value: 'FX', label: 'FX' },
                    { value: 'MM', label: 'Money Market' },
                    { value: 'SEC', label: 'Securities' },
                    { value: 'DER', label: 'Derivatives' },
                    { value: 'BOND', label: 'Bonds' },
                  ]}
                  onChange={(v) => setFilters((f) => ({ ...f, productTaxonomy: v }))}
                />

                {/* Row 2 */}
                <Input
                  placeholder="Counterparty FMCODE"
                  value={filters.counterpartyFmcode}
                  onChange={(v) => setFilters((f) => ({ ...f, counterpartyFmcode: v }))}
                />
                <Select
                  placeholder="SCB Booking Entity"
                  value={filters.bookingEntity}
                  options={[
                    { value: 'London', label: 'London' },
                    { value: 'New York', label: 'New York' },
                    { value: 'Singapore', label: 'Singapore' },
                    { value: 'Hong Kong', label: 'Hong Kong' },
                    { value: 'Tokyo', label: 'Tokyo' },
                  ]}
                  onChange={(v) => setFilters((f) => ({ ...f, bookingEntity: v }))}
                />
                <Input
                  placeholder="Beneficiary Name"
                  value={filters.beneficiaryName}
                  onChange={(v) => setFilters((f) => ({ ...f, beneficiaryName: v }))}
                />
                <Input
                  placeholder="Beneficiary Account BIC Code"
                  value={filters.beneficiaryBic}
                  onChange={(v) => setFilters((f) => ({ ...f, beneficiaryBic: v }))}
                />
                <Input
                  placeholder="Amount Range (Is)"
                  value={filters.amountRange}
                  onChange={(v) => setFilters((f) => ({ ...f, amountRange: v }))}
                  type="number"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!hasFilters}
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!hasFilters}
                  icon={<Search className="w-3.5 h-3.5" />}
                >
                  Search
                </Button>
              </div>
            </Card>
          )}

          {/* Show Search Toggle (when collapsed) */}
          {!searchExpanded && (
            <div className="flex justify-start mb-4">
              <button
                onClick={() => setSearchExpanded(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-xs"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                Show Search
              </button>
            </div>
          )}

          {/* Custom Search/View Panel */}
          <div className="mb-4">
            <CustomSearchViewPanel />
          </div>

          {/* Statistics Bar - Compact Dashboard */}
          <StatisticsBar statGroups={statGroups} onMetricClick={handleMetricClick} />

          {/* Alert */}
          <div className="flex items-start gap-2 p-3 mt-4 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs">
              If more than 1000 records are loaded, column filters will be applied only within the first 1000 records.
            </p>
          </div>

          {/* Data Grid with Header (Footer moved to header) */}
          <Card className="mt-4 overflow-hidden">
            {/* Grid Header - Results and Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-slate-400">Results:</span>
                {selectedRows.size > 0 && (
                  <Badge variant="info" className="text-xs">
                    {selectedRows.size} selected
                  </Badge>
                )}
                <span className="text-xs text-gray-700 dark:text-slate-300 font-medium">
                  {data.length.toLocaleString()} total
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
                <Clock className="w-3 h-3" />
                Last updated: {format(lastUpdated, 'd MMM yyyy, HH:mm:ss')} UTC
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={<Columns className="w-3.5 h-3.5" />}>
                  Resize
                </Button>
                <Button variant="ghost" size="sm" icon={<FileSpreadsheet className="w-3.5 h-3.5" />}>
                  Export
                </Button>
                <Button variant="ghost" size="sm" icon={<Settings className="w-3.5 h-3.5" />} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/30">
                    <th className="p-3 text-left w-10">
                      <Checkbox
                        checked={selectedRows.size === data.length && data.length > 0}
                        onChange={toggleAllRows}
                      />
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-slate-200 transition-colors">
                      <div className="flex items-center gap-1.5">
                        Cashflow ID
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Trade ID
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Value Date
                    </th>
                    <th className="p-3 text-center text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      CCY
                    </th>
                    <th className="p-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Counterparty
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="p-3 text-center text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.slice(0, 15).map((row, index) => {
                    const { formatted, sign, colorClass } = formatAmount(row.amount);
                    const isSelected = selectedRows.has(row.id);

                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors ${
                          isSelected
                            ? 'bg-primary-500/5'
                            : index % 2 === 0
                            ? 'bg-transparent'
                            : 'bg-gray-100 dark:bg-slate-900/20'
                        }`}
                      >
                        <td className="p-3">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleRowSelection(row.id)}
                          />
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-xs text-primary-400 hover:text-primary-300 cursor-pointer hover:underline transition-colors">
                            {row.cashflowId}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-gray-700 dark:text-slate-300">{row.tradeId}</td>
                        <td className="p-3 text-xs text-gray-700 dark:text-slate-300">{row.valueDate}</td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center justify-center min-w-[36px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-xs font-medium text-gray-700 dark:text-slate-300 font-mono">
                            {row.currency}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-mono text-xs ${colorClass}`}>
                            {sign}${formatted}
                          </span>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant={
                              row.cashflowType === 'Payment' ? 'danger' : 'success'
                            }
                            className="text-xs"
                          >
                            {row.cashflowType}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <StatusIndicator status={row.cashflowStatus} />
                        </td>
                        <td className="p-3 text-xs text-gray-700 dark:text-slate-300 truncate max-w-[120px]">
                          {row.counterparty}
                        </td>
                        <td className="p-3 text-xs text-gray-700 dark:text-slate-300">{row.productTaxonomy}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-0.5">
                            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-200 transition-colors">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Mount the app
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <CashflowBlotterPreview />
    </ThemeProvider>
  </React.StrictMode>,
);

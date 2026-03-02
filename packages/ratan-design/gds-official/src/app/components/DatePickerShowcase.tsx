import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Info,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function DatePickerShowcase() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const isInRange = (date: Date) => {
    if (!rangeStart || !rangeEnd) return false;
    return date >= rangeStart && date <= rangeEnd;
  };

  const isRangeStart = (date: Date) => {
    return isSameDay(date, rangeStart);
  };

  const isRangeEnd = (date: Date) => {
    return isSameDay(date, rangeEnd);
  };

  const handleDateClick = (date: Date) => {
    if (!rangeStart || rangeEnd) {
      // Start new range
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      // Complete range
      if (date < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div>
      <h2
        style={{
          fontSize: 'var(--sc-text-section-main)',
          lineHeight: '44px',
          color: 'var(--sc-color-foundation-content-header)',
          marginBottom: '24px',
        }}
      >
        Date picker
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        The date picker presents a calendar interface to let users select dates
        or date ranges. It includes month/year navigation, selectable days,
        keyboard support, and range-hover preview states.
      </p>

      {/* Date Input Field */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Date input field
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Neutral State */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '8px',
                fontWeight: '500',
              }}
            >
              Select date *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={inputValue}
                onChange={(e) => {
                  const input = e.target.value;
                  // Remove all non-numeric characters except /
                  let cleaned = input.replace(/[^\d/]/g, '');

                  // Remove any existing slashes to reformat
                  let numbers = cleaned.replace(/\//g, '');

                  // Limit to 8 digits (DDMMYYYY)
                  numbers = numbers.slice(0, 8);

                  // Auto-format with slashes
                  let formatted = '';
                  for (let i = 0; i < numbers.length; i++) {
                    if (i === 2 || i === 4) {
                      formatted += '/';
                    }
                    formatted += numbers[i];
                  }

                  setInputValue(formatted);
                }}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 40px 0 12px',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '6px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  backgroundColor: 'var(--sc-color-white)',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (document.activeElement !== e.currentTarget) {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-blue-200)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.currentTarget) {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-grey-300)';
                  }
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-blue-500)';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px var(--sc-color-blue-100)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--sc-color-grey-300)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--sc-color-grey-600)',
                }}
              >
                <Calendar size={16} />
              </button>
            </div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
                marginTop: '6px',
              }}
            >
              Select your preferred date
            </p>
          </div>

          {/* Error State */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '8px',
                fontWeight: '500',
              }}
            >
              Departure date *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 40px 0 12px',
                  border: '1px solid var(--sc-color-red-500)',
                  borderRadius: '6px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  backgroundColor: 'var(--sc-color-white)',
                  outline: 'none',
                }}
              />
              <button
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--sc-color-grey-600)',
                }}
              >
                <Calendar size={16} />
              </button>
            </div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-red-500)',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <AlertCircle size={12} />
              Date is required
            </p>
          </div>

          {/* Warning State */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '8px',
                fontWeight: '500',
                position: 'relative',
              }}
            >
              Expiry date *
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--sc-color-grey-600)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Info size={14} />
              </button>
              {showTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: '4px',
                    backgroundColor: 'var(--sc-color-grey-900)',
                    color: 'var(--sc-color-white)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: 'var(--sc-text-description-main)',
                    lineHeight: '16px',
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  Date must be in the future
                </div>
              )}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value="05/02/2026"
                readOnly
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 40px 0 12px',
                  border: '1px solid var(--sc-color-amber-500)',
                  borderRadius: '6px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  backgroundColor: 'var(--sc-color-white)',
                  outline: 'none',
                }}
              />
              <button
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--sc-color-grey-600)',
                }}
              >
                <Calendar size={16} />
              </button>
            </div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-amber-600)',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <AlertCircle size={12} />
              Date expires in 3 days
            </p>
          </div>

          {/* Success State */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                marginBottom: '8px',
                fontWeight: '500',
              }}
            >
              Booking date
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value="20/03/2026"
                readOnly
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 40px 0 12px',
                  border: '1px solid var(--sc-color-green-600)',
                  borderRadius: '6px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  backgroundColor: 'var(--sc-color-white)',
                  outline: 'none',
                }}
              />
              <button
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--sc-color-grey-600)',
                }}
              >
                <Calendar size={16} />
              </button>
            </div>
            <p
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-green-600)',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle size={12} />
              Date confirmed
            </p>
          </div>
        </div>

        {/* With Value and Clear */}
        <div style={{ maxWidth: '320px' }}>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-body)',
              marginBottom: '8px',
              fontWeight: '500',
            }}
          >
            Event date
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value="15/02/2026"
              readOnly
              style={{
                width: '100%',
                height: '40px',
                padding: '0 72px 0 12px',
                border: '1px solid var(--sc-color-grey-300)',
                borderRadius: '6px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-foundation-content-body)',
                backgroundColor: 'var(--sc-color-white)',
                outline: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                gap: '4px',
              }}
            >
              <button
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'var(--sc-color-grey-100)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'var(--sc-color-grey-600)',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-200)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-100)';
                }}
              >
                <X size={14} />
              </button>
              <button
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--sc-color-grey-600)',
                }}
              >
                <Calendar size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Grid - Single Date Selection */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Single date calendar
        </h3>

        <div
          style={{
            width: 'fit-content',
            backgroundColor: 'var(--sc-color-white)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Calendar Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                  ),
                )
              }
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--sc-color-foundation-content-body)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <div
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--sc-color-foundation-content-body)',
              }}
            >
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>

            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                  ),
                )
              }
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--sc-color-foundation-content-body)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day Labels */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '8px',
            }}
          >
            {dayLabels.map((day) => (
              <div
                key={day}
                style={{
                  width: '36px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--sc-color-grey-600)',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
            }}
          >
            {getDaysInMonth(currentMonth).map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    style={{ width: '36px', height: '36px' }}
                  />
                );
              }

              const isCurrentDay = isToday(date);
              const isSelected = isSameDay(date, selectedDate);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border:
                      isCurrentDay && !isSelected
                        ? '1px solid var(--sc-color-blue-500)'
                        : 'none',
                    backgroundColor: isSelected
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: isSelected
                      ? 'var(--sc-color-white)'
                      : 'var(--sc-color-foundation-content-body)',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-white)';
                    }
                  }}
                >
                  {String(date.getDate()).padStart(2, '0')}
                  {isCurrentDay && !isSelected && (
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--sc-color-blue-500)',
                        position: 'absolute',
                        bottom: '4px',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calendar Grid - Date Range Selection */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Date range calendar
        </h3>

        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '12px',
          }}
        >
          Click a start date, then click an end date to select a range
        </p>

        <div
          style={{
            width: 'fit-content',
            backgroundColor: 'var(--sc-color-white)',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Calendar Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                  ),
                )
              }
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--sc-color-foundation-content-body)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <div
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--sc-color-foundation-content-body)',
              }}
            >
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>

            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                  ),
                )
              }
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--sc-color-foundation-content-body)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day Labels */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '8px',
            }}
          >
            {dayLabels.map((day) => (
              <div
                key={day}
                style={{
                  width: '36px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--sc-color-grey-600)',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days with Range */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
            }}
          >
            {getDaysInMonth(currentMonth).map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    style={{ width: '36px', height: '36px' }}
                  />
                );
              }

              const isCurrentDay = isToday(date);
              const inRange = isInRange(date);
              const isStart = isRangeStart(date);
              const isEnd = isRangeEnd(date);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border:
                      isCurrentDay && !isStart && !isEnd
                        ? '1px solid var(--sc-color-blue-500)'
                        : 'none',
                    backgroundColor:
                      isStart || isEnd
                        ? 'var(--sc-color-blue-500)'
                        : inRange
                          ? 'var(--sc-color-blue-50)'
                          : 'var(--sc-color-white)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color:
                      isStart || isEnd
                        ? 'var(--sc-color-white)'
                        : 'var(--sc-color-foundation-content-body)',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isStart && !isEnd) {
                      e.currentTarget.style.backgroundColor = inRange
                        ? 'var(--sc-color-blue-100)'
                        : 'var(--sc-color-grey-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isStart && !isEnd) {
                      e.currentTarget.style.backgroundColor = inRange
                        ? 'var(--sc-color-blue-50)'
                        : 'var(--sc-color-white)';
                    }
                  }}
                >
                  {String(date.getDate()).padStart(2, '0')}
                  {isCurrentDay && !isStart && !isEnd && (
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--sc-color-blue-500)',
                        position: 'absolute',
                        bottom: '4px',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Range Display */}
          {rangeStart && rangeEnd && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'var(--sc-color-blue-25)',
                borderRadius: '6px',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                color: 'var(--sc-color-blue-700)',
              }}
            >
              Selected range: {formatDate(rangeStart)} – {formatDate(rangeEnd)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

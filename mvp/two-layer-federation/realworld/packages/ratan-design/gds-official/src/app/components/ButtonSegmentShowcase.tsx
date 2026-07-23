import { useState } from 'react';
import { LayoutGrid, List, Calendar, BarChart3, Clock } from 'lucide-react';

export default function ButtonSegmentShowcase() {
  const [viewMode, setViewMode] = useState('list');
  const [timePeriod, setTimePeriod] = useState('week');
  const [statusFilter, setStatusFilter] = useState('all');
  const [displayDensity, setDisplayDensity] = useState('comfortable');

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
        Button segment
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Button Segment groups multiple related options into a single cohesive
        control. Only one option is selected at a time for view switches,
        filters, and display preferences.
      </p>

      {/* Two Segments */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          View switcher (2 segments)
        </h3>

        <div style={{ display: 'flex', gap: '0', width: 'fit-content' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              height: '32px',
              padding: '0 16px',
              border: `1px solid ${viewMode === 'list' ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
              borderRight:
                viewMode === 'list'
                  ? '1px solid var(--sc-color-blue-500)'
                  : 'none',
              borderTopLeftRadius: '6px',
              borderBottomLeftRadius: '6px',
              backgroundColor:
                viewMode === 'list'
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-white)',
              color:
                viewMode === 'list'
                  ? 'var(--sc-color-white)'
                  : 'var(--sc-color-foundation-content-body)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'list') {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-300)';
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-blue-25)';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'list') {
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }
            }}
          >
            <List size={16} />
            List
          </button>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              height: '32px',
              padding: '0 16px',
              border: `1px solid ${viewMode === 'grid' ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
              borderTopRightRadius: '6px',
              borderBottomRightRadius: '6px',
              backgroundColor:
                viewMode === 'grid'
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-white)',
              color:
                viewMode === 'grid'
                  ? 'var(--sc-color-white)'
                  : 'var(--sc-color-foundation-content-body)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (viewMode !== 'grid') {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-300)';
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-blue-25)';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== 'grid') {
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }
            }}
          >
            <LayoutGrid size={16} />
            Grid
          </button>
        </div>
      </section>

      {/* Three Segments */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Status filter (3 segments)
        </h3>

        <div style={{ display: 'flex', gap: '0', width: 'fit-content' }}>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              height: '32px',
              padding: '0 16px',
              border: `1px solid ${statusFilter === 'all' ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
              borderRight:
                statusFilter === 'all'
                  ? '1px solid var(--sc-color-blue-500)'
                  : 'none',
              borderTopLeftRadius: '6px',
              borderBottomLeftRadius: '6px',
              backgroundColor:
                statusFilter === 'all'
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-white)',
              color:
                statusFilter === 'all'
                  ? 'var(--sc-color-white)'
                  : 'var(--sc-color-foundation-content-body)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== 'all') {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-300)';
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-blue-25)';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== 'all') {
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }
            }}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            style={{
              height: '32px',
              padding: '0 16px',
              border: `1px solid ${statusFilter === 'open' ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
              borderRight:
                statusFilter === 'open'
                  ? '1px solid var(--sc-color-blue-500)'
                  : 'none',
              backgroundColor:
                statusFilter === 'open'
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-white)',
              color:
                statusFilter === 'open'
                  ? 'var(--sc-color-white)'
                  : 'var(--sc-color-foundation-content-body)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== 'open') {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-300)';
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-blue-25)';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== 'open') {
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }
            }}
          >
            Open
          </button>
          <button
            onClick={() => setStatusFilter('closed')}
            style={{
              height: '32px',
              padding: '0 16px',
              border: `1px solid ${statusFilter === 'closed' ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
              borderTopRightRadius: '6px',
              borderBottomRightRadius: '6px',
              backgroundColor:
                statusFilter === 'closed'
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-white)',
              color:
                statusFilter === 'closed'
                  ? 'var(--sc-color-white)'
                  : 'var(--sc-color-foundation-content-body)',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== 'closed') {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-300)';
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-blue-25)';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== 'closed') {
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }
            }}
          >
            Closed
          </button>
        </div>
      </section>

      {/* Four Segments */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Time period selector (4 segments)
        </h3>

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
            Select time period
          </label>

          <div style={{ display: 'flex', gap: '0', width: 'fit-content' }}>
            {['day', 'week', 'month', 'year'].map((period, index) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  border: `1px solid ${timePeriod === period ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
                  borderRight:
                    timePeriod === period || index === 3
                      ? `1px solid ${timePeriod === period ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`
                      : 'none',
                  borderTopLeftRadius: index === 0 ? '6px' : '0',
                  borderBottomLeftRadius: index === 0 ? '6px' : '0',
                  borderTopRightRadius: index === 3 ? '6px' : '0',
                  borderBottomRightRadius: index === 3 ? '6px' : '0',
                  backgroundColor:
                    timePeriod === period
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                  color:
                    timePeriod === period
                      ? 'var(--sc-color-white)'
                      : 'var(--sc-color-foundation-content-body)',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (timePeriod !== period) {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-blue-300)';
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-blue-25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (timePeriod !== period) {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-grey-300)';
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-white)';
                  }
                }}
              >
                {period}
              </button>
            ))}
          </div>

          <p
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-helper-text)',
              marginTop: '6px',
            }}
          >
            Choose the reporting period for your data
          </p>
        </div>
      </section>

      {/* Five Segments */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Display density (5 segments)
        </h3>

        <div style={{ display: 'flex', gap: '0', width: 'fit-content' }}>
          {['compact', 'comfortable', 'spacious', 'relaxed', 'expanded'].map(
            (density, index) => (
              <button
                key={density}
                onClick={() => setDisplayDensity(density)}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  border: `1px solid ${displayDensity === density ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
                  borderRight:
                    displayDensity === density || index === 4
                      ? `1px solid ${displayDensity === density ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`
                      : 'none',
                  borderTopLeftRadius: index === 0 ? '6px' : '0',
                  borderBottomLeftRadius: index === 0 ? '6px' : '0',
                  borderTopRightRadius: index === 4 ? '6px' : '0',
                  borderBottomRightRadius: index === 4 ? '6px' : '0',
                  backgroundColor:
                    displayDensity === density
                      ? 'var(--sc-color-blue-500)'
                      : 'var(--sc-color-white)',
                  color:
                    displayDensity === density
                      ? 'var(--sc-color-white)'
                      : 'var(--sc-color-foundation-content-body)',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (displayDensity !== density) {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-blue-300)';
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-blue-25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (displayDensity !== density) {
                    e.currentTarget.style.borderColor =
                      'var(--sc-color-grey-300)';
                    e.currentTarget.style.backgroundColor =
                      'var(--sc-color-white)';
                  }
                }}
              >
                {density}
              </button>
            ),
          )}
        </div>
      </section>

      {/* Icon Only */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Icon only segments
        </h3>

        <div style={{ display: 'flex', gap: '0', width: 'fit-content' }}>
          {[
            { id: 'calendar', icon: <Calendar size={16} /> },
            { id: 'chart', icon: <BarChart3 size={16} /> },
            { id: 'clock', icon: <Clock size={16} /> },
          ].map((item, index) => (
            <button
              key={item.id}
              style={{
                height: '32px',
                width: '40px',
                padding: '8px',
                border: '1px solid var(--sc-color-grey-300)',
                borderRight:
                  index === 2 ? '1px solid var(--sc-color-grey-300)' : 'none',
                borderTopLeftRadius: index === 0 ? '6px' : '0',
                borderBottomLeftRadius: index === 0 ? '6px' : '0',
                borderTopRightRadius: index === 2 ? '6px' : '0',
                borderBottomRightRadius: index === 2 ? '6px' : '0',
                backgroundColor: 'var(--sc-color-white)',
                color: 'var(--sc-color-foundation-content-body)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--sc-color-blue-300)';
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-blue-25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--sc-color-grey-300)';
                e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
              }}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </section>

      {/* Disabled State */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Disabled state
        </h3>

        <div
          style={{
            display: 'flex',
            gap: '0',
            width: 'fit-content',
            opacity: 0.5,
          }}
        >
          {['option 1', 'option 2', 'option 3'].map((option, index) => (
            <button
              key={option}
              disabled
              style={{
                height: '32px',
                padding: '0 16px',
                border: `1px solid ${index === 0 ? 'var(--sc-color-blue-400)' : 'var(--sc-color-grey-300)'}`,
                borderRight:
                  index === 2 ? '1px solid var(--sc-color-grey-300)' : 'none',
                borderTopLeftRadius: index === 0 ? '6px' : '0',
                borderBottomLeftRadius: index === 0 ? '6px' : '0',
                borderTopRightRadius: index === 2 ? '6px' : '0',
                borderBottomRightRadius: index === 2 ? '6px' : '0',
                backgroundColor:
                  index === 0
                    ? 'var(--sc-color-blue-400)'
                    : 'var(--sc-color-white)',
                color:
                  index === 0
                    ? 'var(--sc-color-white)'
                    : 'var(--sc-color-foundation-content-body)',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'not-allowed',
                textTransform: 'capitalize',
                outline: 'none',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

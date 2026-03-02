import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showTotalCount = false,
  totalItems,
  itemsPerPage,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showTotalCount?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem =
    showTotalCount && totalItems && itemsPerPage
      ? (currentPage - 1) * itemsPerPage + 1
      : 0;
  const endItem =
    showTotalCount && totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      {showTotalCount && totalItems && itemsPerPage && (
        <div
          style={{
            fontSize: 'var(--sc-text-component-main)',
            lineHeight: '22px',
            color: 'var(--sc-color-foundation-content-body)',
          }}
        >
          {startItem}–{endItem} of {totalItems} items
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--sc-color-grey-200)',
            borderRadius: '6px',
            backgroundColor: 'var(--sc-color-white)',
            color:
              currentPage === 1
                ? 'var(--sc-color-foundation-content-disabled-text)'
                : 'var(--sc-color-foundation-content-body)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
          }}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                }}
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              style={{
                minWidth: '32px',
                height: '32px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isActive
                  ? 'none'
                  : '1px solid var(--sc-color-grey-200)',
                borderRadius: '6px',
                backgroundColor: isActive
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-white)',
                color: isActive
                  ? 'var(--sc-color-white)'
                  : 'var(--sc-color-foundation-content-body)',
                fontSize: 'var(--sc-text-component-main)',
                lineHeight: '22px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? '500' : '400',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-white)';
                }
              }}
              onFocus={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px var(--sc-color-blue-100)';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--sc-color-grey-200)',
            borderRadius: '6px',
            backgroundColor: 'var(--sc-color-white)',
            color:
              currentPage === totalPages
                ? 'var(--sc-color-foundation-content-disabled-text)'
                : 'var(--sc-color-foundation-content-body)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-50)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--sc-color-white)';
          }}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default function PaginationShowcase() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(5);
  const [page3, setPage3] = useState(1);

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
        Pagination
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Pagination splits content into several pages and lets users navigate
        between them. It supports truncation and total count display.
      </p>

      {/* Basic pagination */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic pagination
        </h3>

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--sc-color-grey-50)',
            borderRadius: '6px',
          }}
        >
          <Pagination
            currentPage={page1}
            totalPages={10}
            onPageChange={setPage1}
          />
        </div>
      </section>

      {/* With total count */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With total count
        </h3>

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--sc-color-grey-50)',
            borderRadius: '6px',
          }}
        >
          <Pagination
            currentPage={page3}
            totalPages={20}
            onPageChange={setPage3}
            showTotalCount={true}
            totalItems={200}
            itemsPerPage={10}
          />
        </div>
      </section>

      {/* Large page count (middle truncated) */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Large page count with truncation
        </h3>

        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--sc-color-grey-50)',
            borderRadius: '6px',
          }}
        >
          <Pagination
            currentPage={page2}
            totalPages={50}
            onPageChange={setPage2}
            showTotalCount={true}
            totalItems={500}
            itemsPerPage={10}
          />
        </div>

        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginTop: '12px',
          }}
        >
          Current page: {page2}
        </p>
      </section>
    </div>
  );
}

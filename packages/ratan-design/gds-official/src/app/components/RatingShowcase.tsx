import { useState } from 'react';
import { Star, Heart, ChevronDown } from 'lucide-react';

interface RatingProps {
  segments?: 5 | 10;
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  intent?: 'neutral' | 'error';
  groupLabel?: string;
  helperText?: string;
  validationMessage?: string;
  icon?: 'star' | 'heart' | 'number';
}

const Rating = ({
  segments = 5,
  value = 0,
  onChange,
  readOnly = false,
  intent = 'neutral',
  groupLabel,
  helperText,
  validationMessage,
  icon = 'number',
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      // Allow deselection if clicking the same value
      onChange(rating === value ? 0 : rating);
    }
  };

  const getButtonStyle = (index: number) => {
    const isActive = hoverValue !== null ? index <= hoverValue : index <= value;

    // Star rating uses different styling (icon link button style)
    if (icon === 'star') {
      return {
        width: '32px',
        height: '32px',
        padding: 0,
        backgroundColor: 'transparent',
        color: isActive
          ? 'var(--sc-color-blue-500)'
          : 'var(--sc-color-grey-400)',
        border: 'none',
        cursor: readOnly ? 'default' : 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
      };
    }

    // Numeric rating follows button segment style
    const baseStyle = {
      minWidth: icon === 'number' ? '44px' : '32px',
      height: '32px',
      padding: icon === 'number' ? '0 12px' : '0 4px',
      backgroundColor: isActive
        ? 'var(--sc-color-blue-500)'
        : 'var(--sc-color-white)',
      color: isActive
        ? 'var(--sc-color-white)'
        : 'var(--sc-color-foundation-content-body)',
      border: `1px solid ${
        intent === 'error'
          ? 'var(--sc-color-red-500)'
          : isActive
            ? 'var(--sc-color-blue-500)'
            : 'var(--sc-color-grey-300)'
      }`,
      borderRadius: segments === 5 ? '6px' : '4px',
      fontSize: 'var(--sc-text-component-main)',
      lineHeight: '22px',
      cursor: readOnly ? 'default' : 'pointer',
      transition: 'all 0.15s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
    };

    return baseStyle;
  };

  const renderIcon = (index: number) => {
    const isActive = hoverValue !== null ? index <= hoverValue : index <= value;

    if (icon === 'star') {
      return <Star size={20} fill={isActive ? 'currentColor' : 'none'} />;
    }
    if (icon === 'heart') {
      return <Heart size={20} fill={isActive ? 'currentColor' : 'none'} />;
    }
    return index;
  };

  return (
    <div>
      {groupLabel && (
        <label
          style={{
            display: 'block',
            fontSize: 'var(--sc-text-label-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-label-text)',
            marginBottom: '8px',
          }}
        >
          {groupLabel}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          gap: segments === 5 ? '6px' : '4px',
          flexWrap: 'wrap',
        }}
      >
        {Array.from({ length: segments }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => !readOnly && setHoverValue(rating)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            disabled={readOnly}
            style={getButtonStyle(rating)}
          >
            {renderIcon(rating)}
          </button>
        ))}
      </div>

      {helperText && (
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginTop: '6px',
            marginBottom: 0,
          }}
        >
          {helperText}
        </p>
      )}

      {validationMessage && (
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color:
              intent === 'error'
                ? 'var(--sc-color-red-550)'
                : 'var(--sc-color-foundation-content-body)',
            marginTop: '6px',
            marginBottom: 0,
          }}
        >
          {validationMessage}
        </p>
      )}
    </div>
  );
};

interface TruncatedRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  groupLabel?: string;
}

const TruncatedRating = ({
  value = 0,
  onChange,
  groupLabel,
}: TruncatedRatingProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {groupLabel && (
        <label
          style={{
            display: 'block',
            fontSize: 'var(--sc-text-label-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-label-text)',
            marginBottom: '8px',
          }}
        >
          {groupLabel}
        </label>
      )}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => onChange && onChange(value === 0 ? 1 : 0)}
            style={{
              minWidth: '80px',
              height: '32px',
              padding: '0 12px',
              backgroundColor:
                value > 0
                  ? 'var(--sc-color-blue-500)'
                  : 'var(--sc-color-white)',
              color:
                value > 0
                  ? 'var(--sc-color-white)'
                  : 'var(--sc-color-foundation-content-body)',
              border: `1px solid ${value > 0 ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
              borderRadius: '6px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {value > 0 ? `Selected: ${value}` : 'Select'}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              minWidth: '44px',
              height: '32px',
              padding: '0 12px',
              backgroundColor: 'var(--sc-color-white)',
              color: 'var(--sc-color-foundation-content-body)',
              border: '1px solid var(--sc-color-grey-300)',
              borderRadius: '6px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronDown
              size={16}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '36px',
              left: 0,
              backgroundColor: 'var(--sc-color-white)',
              border: '1px solid var(--sc-color-grey-300)',
              borderRadius: '6px',
              padding: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 10,
              minWidth: '200px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
                <button
                  key={rating}
                  onClick={() => {
                    onChange && onChange(rating);
                    setIsOpen(false);
                  }}
                  style={{
                    minWidth: '44px',
                    height: '32px',
                    padding: '0 12px',
                    backgroundColor:
                      rating === value
                        ? 'var(--sc-color-blue-500)'
                        : 'var(--sc-color-white)',
                    color:
                      rating === value
                        ? 'var(--sc-color-white)'
                        : 'var(--sc-color-foundation-content-body)',
                    border: `1px solid ${rating === value ? 'var(--sc-color-blue-500)' : 'var(--sc-color-grey-300)'}`,
                    borderRadius: '4px',
                    fontSize: 'var(--sc-text-component-main)',
                    lineHeight: '22px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (rating !== value) {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-grey-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (rating !== value) {
                      e.currentTarget.style.backgroundColor =
                        'var(--sc-color-white)';
                    }
                  }}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function RatingShowcase() {
  const [rating5, setRating5] = useState(0);
  const [rating10, setRating10] = useState(0);
  const [ratingStar, setRatingStar] = useState(0);
  const [ratingError, setRatingError] = useState(0);
  const [ratingTruncated, setRatingTruncated] = useState(0);

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
        Rating
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Rating component enables users to provide feedback or view evaluation
        scores. Icon size: 20-24px, gap between icons: 4-8px, group label
        spacing: 4-8px above component.
      </p>

      {/* 5-segment rating */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          5-segment rating
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <Rating
            segments={5}
            value={rating5}
            onChange={setRating5}
            groupLabel="Rate your experience"
            helperText="1 = Poor, 5 = Excellent"
          />

          <p
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-body)',
              marginTop: '16px',
            }}
          >
            Selected rating: {rating5 || 'None'}
          </p>
        </div>
      </section>

      {/* 10-segment rating */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          10-segment rating
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <Rating
            segments={10}
            value={rating10}
            onChange={setRating10}
            groupLabel="How likely are you to recommend us?"
            helperText="1 = Not likely, 10 = Very likely"
          />

          <p
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-body)',
              marginTop: '16px',
            }}
          >
            Selected rating: {rating10 || 'None'}
          </p>
        </div>
      </section>

      {/* 5-star rating */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          5-star rating
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <Rating
            segments={5}
            value={ratingStar}
            onChange={setRatingStar}
            icon="star"
            groupLabel="Rate this product"
            helperText="Click to rate from 1 to 5 stars"
          />

          <p
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-body)',
              marginTop: '16px',
            }}
          >
            Selected rating: {ratingStar || 'None'}{' '}
            {ratingStar > 0 && `star${ratingStar > 1 ? 's' : ''}`}
          </p>
        </div>
      </section>

      {/* Truncated rating */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Truncated rating
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <TruncatedRating
            value={ratingTruncated}
            onChange={setRatingTruncated}
            groupLabel="Select rating (1-10)"
          />

          <p
            style={{
              fontSize: 'var(--sc-text-description-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-body)',
              marginTop: '16px',
            }}
          >
            Selected rating: {ratingTruncated || 'None'}
          </p>
        </div>
      </section>

      {/* Error state */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Error state
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <Rating
            segments={5}
            value={ratingError}
            onChange={setRatingError}
            intent="error"
            groupLabel="Rate your experience *"
            validationMessage={
              ratingError === 0 ? 'This field is required' : ''
            }
          />
        </div>
      </section>

      {/* Read-only rating */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Read-only rating
        </h3>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <Rating
              segments={5}
              value={4}
              readOnly={true}
              icon="star"
              groupLabel="Average customer rating"
            />

            <Rating
              segments={5}
              value={3}
              readOnly={true}
              groupLabel="Service quality"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

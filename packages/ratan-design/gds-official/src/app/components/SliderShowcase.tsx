import React, { useState, useRef } from 'react';

// CSS to hide native range input thumbs
const sliderStyles = `
  .custom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 0;
    height: 0;
    opacity: 0;
  }
  
  .custom-slider::-moz-range-thumb {
    width: 0;
    height: 0;
    opacity: 0;
    border: none;
    background: transparent;
  }
  
  .custom-slider::-ms-thumb {
    width: 0;
    height: 0;
    opacity: 0;
  }
`;

const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  disabled = false,
  label = '',
  supportingText = '',
  validationMessage = '',
  hasInputField = false,
  hasBadge = false,
  intent = 'neutral' as 'neutral' | 'error',
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
  supportingText?: string;
  validationMessage?: string;
  hasInputField?: boolean;
  hasBadge?: boolean;
  intent?: 'neutral' | 'error';
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;
  const trackColor =
    intent === 'error' ? 'var(--sc-color-red-500)' : 'var(--sc-color-blue-500)';
  const showBadge = hasBadge && (isHovered || isDragging);

  const getValidationColor = () => {
    return intent === 'error'
      ? 'var(--sc-color-red-550)'
      : 'var(--sc-color-foundation-content-helper-text)';
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ marginBottom: '8px' }}>
          <label
            style={{
              fontSize: 'var(--sc-text-label-main)',
              lineHeight: '16px',
              color: disabled
                ? 'var(--sc-color-grey-400)'
                : 'var(--sc-color-foundation-content-label-text)',
              display: 'block',
              marginBottom: supportingText ? '4px' : 0,
            }}
          >
            {label}
          </label>
          {supportingText && (
            <div
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
              }}
            >
              {supportingText}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div
          style={{ flex: 1, position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Badge above handle */}
          {showBadge && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: `${percentage}%`,
                transform: 'translateX(-50%)',
                marginBottom: '8px',
                backgroundColor: 'var(--sc-color-grey-800)',
                color: 'var(--sc-color-white)',
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                padding: '4px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            >
              {value}
            </div>
          )}

          {/* Track background */}
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'var(--sc-color-grey-200)',
              borderRadius: '2px',
              position: 'relative',
            }}
          >
            {/* Filled track */}
            <div
              style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: disabled
                  ? 'var(--sc-color-grey-300)'
                  : trackColor,
                borderRadius: '2px',
                transition: 'width 0.1s ease',
              }}
            />
          </div>

          {/* Slider input */}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            disabled={disabled}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '20px',
              margin: 0,
              padding: 0,
              transform: 'translateY(-50%)',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              background: 'transparent',
              outline: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              zIndex: 2,
            }}
            className="custom-slider"
          />

          {/* Thumb */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${percentage}%`,
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              backgroundColor: 'var(--sc-color-white)',
              border: `2px solid ${disabled ? 'var(--sc-color-grey-300)' : trackColor}`,
              borderRadius: '50%',
              boxShadow: isDragging
                ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                : isHovered
                  ? '0 1px 4px rgba(0, 0, 0, 0.15)'
                  : '0 1px 3px rgba(0, 0, 0, 0.1)',
              pointerEvents: 'none',
              transition: 'left 0.1s ease, box-shadow 0.15s ease',
              zIndex: 1,
            }}
          />
        </div>

        {hasInputField && (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            disabled={disabled}
            style={{
              width: '80px',
              height: '32px',
              padding: '0 12px',
              border: `1px solid ${intent === 'error' ? 'var(--sc-color-red-500)' : 'var(--sc-color-grey-300)'}`,
              borderRadius: '4px',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              color: 'var(--sc-color-foundation-content-input-text)',
              backgroundColor: disabled
                ? 'var(--sc-color-grey-50)'
                : 'var(--sc-color-white)',
              outline: 'none',
            }}
          />
        )}
      </div>

      {/* Validation message */}
      {validationMessage && (
        <div
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: getValidationColor(),
            marginTop: '6px',
          }}
        >
          {validationMessage}
        </div>
      )}
    </div>
  );
};

const RangeSlider = ({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  min = 0,
  max = 100,
  label = '',
}: {
  startValue: number;
  endValue: number;
  onStartChange: (value: number) => void;
  onEndChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) => {
  const [activeHandle, setActiveHandle] = useState<'start' | 'end' | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const startPercentage = ((startValue - min) / (max - min)) * 100;
  const endPercentage = ((endValue - min) / (max - min)) * 100;

  // Determine which handle should be on top based on click position
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercentage = (clickX / rect.width) * 100;

    // Calculate distance from click to each handle
    const distanceToStart = Math.abs(clickPercentage - startPercentage);
    const distanceToEnd = Math.abs(clickPercentage - endPercentage);

    // Set active handle to the one closer to the click
    if (distanceToStart < distanceToEnd) {
      setActiveHandle('start');
    } else {
      setActiveHandle('end');
    }
  };

  // Calculate z-index based on which handle is active
  const getStartZIndex = () => {
    if (activeHandle === 'start') return 4;
    if (activeHandle === 'end') return 1;
    return 3;
  };

  const getEndZIndex = () => {
    if (activeHandle === 'end') return 4;
    if (activeHandle === 'start') return 1;
    return 2;
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          style={{
            fontSize: 'var(--sc-text-label-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-label-text)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{ position: 'relative' }}
        ref={containerRef}
        onClick={handleContainerClick}
      >
        {/* Track background */}
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'var(--sc-color-grey-200)',
            borderRadius: '2px',
            position: 'relative',
          }}
        >
          {/* Filled track between handles */}
          <div
            style={{
              position: 'absolute',
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`,
              height: '100%',
              backgroundColor: 'var(--sc-color-blue-500)',
              borderRadius: '2px',
              transition: 'all 0.1s ease',
            }}
          />
        </div>

        {/* Start handle input */}
        <input
          type="range"
          min={min}
          max={endValue}
          value={startValue}
          onChange={(e) => onStartChange(Number(e.target.value))}
          onMouseDown={() => setActiveHandle('start')}
          onMouseUp={() => setActiveHandle(null)}
          onTouchStart={() => setActiveHandle('start')}
          onTouchEnd={() => setActiveHandle(null)}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '20px',
            margin: 0,
            padding: 0,
            transform: 'translateY(-50%)',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            background: 'transparent',
            outline: 'none',
            cursor: 'pointer',
            zIndex: getStartZIndex(),
          }}
          className="custom-slider"
        />

        {/* End handle input */}
        <input
          type="range"
          min={startValue}
          max={max}
          value={endValue}
          onChange={(e) => onEndChange(Number(e.target.value))}
          onMouseDown={() => setActiveHandle('end')}
          onMouseUp={() => setActiveHandle(null)}
          onTouchStart={() => setActiveHandle('end')}
          onTouchEnd={() => setActiveHandle(null)}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '20px',
            margin: 0,
            padding: 0,
            transform: 'translateY(-50%)',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            background: 'transparent',
            outline: 'none',
            cursor: 'pointer',
            zIndex: getEndZIndex(),
          }}
          className="custom-slider"
        />

        {/* Start thumb */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${startPercentage}%`,
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            backgroundColor: 'var(--sc-color-white)',
            border: '2px solid var(--sc-color-blue-500)',
            borderRadius: '50%',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'none',
            zIndex: getStartZIndex(),
          }}
        />

        {/* End thumb */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${endPercentage}%`,
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            backgroundColor: 'var(--sc-color-white)',
            border: '2px solid var(--sc-color-blue-500)',
            borderRadius: '50%',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'none',
            zIndex: getEndZIndex(),
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          fontSize: 'var(--sc-text-description-main)',
          lineHeight: '16px',
          color: 'var(--sc-color-foundation-content-helper-text)',
        }}
      >
        <span>{startValue}</span>
        <span>{endValue}</span>
      </div>
    </div>
  );
};

export default function SliderShowcase() {
  const [value1, setValue1] = useState(50);
  const [value2, setValue2] = useState(30);
  const [rangeStart, setRangeStart] = useState(25);
  const [rangeEnd, setRangeEnd] = useState(75);
  const [errorValue, setErrorValue] = useState(95);

  return (
    <div>
      {/* Inject CSS styles for hiding native slider thumbs */}
      <style>{sliderStyles}</style>

      <h2
        style={{
          fontSize: 'var(--sc-text-section-main)',
          lineHeight: '44px',
          color: 'var(--sc-color-foundation-content-header)',
          marginBottom: '24px',
        }}
      >
        Slider
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Sliders allow users to select a value or range within a defined
        interval. They support single-value and range selection with optional
        input fields.
      </p>

      {/* Basic slider */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Single value selector
        </h3>

        <div style={{ maxWidth: '400px' }}>
          <Slider
            value={value1}
            onChange={setValue1}
            label="Volume"
            supportingText="Adjust the audio volume level"
            hasBadge
          />
        </div>
      </section>

      {/* With input field */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With input field
        </h3>

        <div style={{ maxWidth: '400px' }}>
          <Slider
            value={value2}
            onChange={setValue2}
            label="Brightness"
            supportingText="Enter a value between 0 and 100"
            hasInputField
            hasBadge
          />
        </div>
      </section>

      {/* Range slider */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Range selector
        </h3>

        <div style={{ maxWidth: '400px' }}>
          <RangeSlider
            startValue={rangeStart}
            endValue={rangeEnd}
            onStartChange={setRangeStart}
            onEndChange={setRangeEnd}
            label="Price range"
          />
        </div>
      </section>

      {/* Disabled state */}
      <section style={{ marginBottom: '48px' }}>
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

        <div style={{ maxWidth: '400px' }}>
          <Slider
            value={60}
            onChange={() => {}}
            label="Disabled slider"
            disabled
          />
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

        <div style={{ maxWidth: '400px' }}>
          <Slider
            value={errorValue}
            onChange={setErrorValue}
            label="Temperature"
            supportingText="Value exceeds safe operating range"
            validationMessage="Temperature is too high!"
            intent="error"
            hasInputField
            hasBadge
          />
        </div>
      </section>
    </div>
  );
}

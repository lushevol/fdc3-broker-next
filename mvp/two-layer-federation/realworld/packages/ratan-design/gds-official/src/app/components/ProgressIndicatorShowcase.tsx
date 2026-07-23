import { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface LinearProgressProps {
  progress: number;
  showPercentage?: boolean;
  intent?: 'neutral' | 'success' | 'error';
  label?: string;
}

const LinearProgress = ({
  progress,
  showPercentage = true,
  intent = 'neutral',
  label,
}: LinearProgressProps) => {
  const getProgressColor = () => {
    switch (intent) {
      case 'success':
        return 'var(--sc-color-green-600)';
      case 'error':
        return 'var(--sc-color-red-500)';
      default:
        return 'var(--sc-color-blue-500)';
    }
  };

  return (
    <div>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: 'var(--sc-text-label-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-label-text)',
            }}
          >
            {label}
          </span>
          {showPercentage && (
            <span
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-body)',
              }}
            >
              {progress}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--sc-color-grey-100)',
          borderRadius: 'calc(var(--sc-radius-sm) / 2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: getProgressColor(),
            transition: 'width 0.25s ease',
            borderRadius: 'calc(var(--sc-radius-sm) / 2)',
          }}
        />
      </div>
    </div>
  );
};

interface SegmentedProgressProps {
  currentSegment: number;
  totalSegments: number;
  intent?: 'neutral' | 'success' | 'error';
  label?: string;
  showStepCount?: boolean;
}

const SegmentedProgress = ({
  currentSegment,
  totalSegments,
  intent = 'neutral',
  label,
  showStepCount = true,
}: SegmentedProgressProps) => {
  const getProgressColor = () => {
    switch (intent) {
      case 'success':
        return 'var(--sc-color-green-600)';
      case 'error':
        return 'var(--sc-color-red-500)';
      default:
        return 'var(--sc-color-blue-500)';
    }
  };

  return (
    <div>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: 'var(--sc-text-label-main)',
              lineHeight: '16px',
              color: 'var(--sc-color-foundation-content-label-text)',
            }}
          >
            {label}
          </span>
          {showStepCount && (
            <span
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-body)',
              }}
            >
              {currentSegment}/{totalSegments}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          width: '100%',
        }}
      >
        {Array.from({ length: totalSegments }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '6px',
              backgroundColor:
                i < currentSegment
                  ? getProgressColor()
                  : 'var(--sc-color-grey-100)',
              borderRadius: 'calc(var(--sc-radius-sm) / 2)',
              transition: 'background-color 0.25s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface GlyphProgressProps {
  progress: number;
  size?: number;
  intent?: 'neutral' | 'success' | 'error';
}

const GlyphProgress = ({
  progress,
  size = 16,
  intent = 'neutral',
}: GlyphProgressProps) => {
  const getProgressColor = () => {
    switch (intent) {
      case 'success':
        return 'var(--sc-color-green-600)';
      case 'error':
        return 'var(--sc-color-red-500)';
      default:
        return 'var(--sc-color-blue-500)';
    }
  };

  const radius = size / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const isComplete = progress === 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          flexShrink: 0,
        }}
      >
        {isComplete ? (
          // Filled circle with icon at 100%
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: getProgressColor(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sc-color-white)',
            }}
          >
            {intent === 'success' ? (
              <Check size={size * 0.6} strokeWidth={2.5} />
            ) : intent === 'error' ? (
              <AlertTriangle size={size * 0.6} strokeWidth={2.5} />
            ) : (
              <Check size={size * 0.6} strokeWidth={2.5} />
            )}
          </div>
        ) : (
          // Progress circle
          <svg
            width={size}
            height={size}
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius - 2}
              stroke="var(--sc-color-grey-200)"
              strokeWidth={2}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius - 2}
              stroke={getProgressColor()}
              strokeWidth={2}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.25s ease',
              }}
            />
          </svg>
        )}
      </div>
      <span
        style={{
          fontSize: 'var(--sc-text-description-main)',
          lineHeight: '16px',
          color: getProgressColor(),
          fontWeight: '400',
        }}
      >
        {progress}%
      </span>
    </div>
  );
};

interface PercentageOnlyProps {
  progress: number;
  intent?: 'neutral' | 'success' | 'error';
  label?: string;
}

const PercentageOnly = ({
  progress,
  intent = 'neutral',
  label,
}: PercentageOnlyProps) => {
  const getProgressColor = () => {
    switch (intent) {
      case 'success':
        return 'var(--sc-color-green-600)';
      case 'error':
        return 'var(--sc-color-red-500)';
      default:
        return 'var(--sc-color-blue-500)';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {label && (
        <span
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-body)',
          }}
        >
          {label}
        </span>
      )}
      <span
        style={{
          fontSize: 'var(--sc-text-component-main)',
          lineHeight: '22px',
          color: getProgressColor(),
          fontWeight: '500',
        }}
      >
        {progress}%
      </span>
    </div>
  );
};

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  intent?: 'neutral' | 'success' | 'error';
  showPercentage?: boolean;
  label?: string;
}

const CircularProgress = ({
  progress,
  size = 120,
  strokeWidth = 8,
  intent = 'neutral',
  showPercentage = true,
  label,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getProgressColor = () => {
    switch (intent) {
      case 'success':
        return 'var(--sc-color-green-600)';
      case 'error':
        return 'var(--sc-color-red-500)';
      default:
        return 'var(--sc-color-blue-500)';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {label && (
        <span
          style={{
            fontSize: 'var(--sc-text-label-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-label-text)',
          }}
        >
          {label}
        </span>
      )}
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--sc-color-grey-100)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getProgressColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.25s ease',
            }}
          />
        </svg>
        {showPercentage && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 'var(--sc-text-title-sub)',
              lineHeight: '24px',
              fontWeight: '500',
              color: 'var(--sc-color-foundation-content-body)',
            }}
          >
            {progress}%
          </div>
        )}
      </div>
    </div>
  );
};

export default function ProgressIndicatorShowcase() {
  const [linearProgress, setLinearProgress] = useState(45);
  const [circularProgress, setCircularProgress] = useState(65);
  const [segmentedProgress, setSegmentedProgress] = useState(3);
  const [glyphProgress, setGlyphProgress] = useState(72);

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
        Progress indicators
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Progress indicators communicate the status of an ongoing process. They
        can be Bar, Segmented Bar, or Circle styles, and support intents and
        percentage labels.
      </p>

      {/* Bar style */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '8px',
          }}
        >
          Bar style
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Used when progress is continuous. Best for uploads, installs, large
          tasks.
        </p>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <LinearProgress progress={linearProgress} label="Upload progress" />
            <LinearProgress
              progress={linearProgress}
              label="Installation progress"
            />

            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() =>
                  setLinearProgress(Math.max(0, linearProgress - 10))
                }
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-foundation-content-body)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Decrease
              </button>
              <button
                onClick={() =>
                  setLinearProgress(Math.min(100, linearProgress + 10))
                }
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-blue-500)',
                  color: 'var(--sc-color-white)',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Increase
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Segmented bar style */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '8px',
          }}
        >
          Segmented bar style
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Steps are discrete. Best for forms, onboarding, wizards. Each segment
          represents a step completed.
        </p>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <SegmentedProgress
              currentSegment={segmentedProgress}
              totalSegments={5}
              label="Application progress"
            />
            <SegmentedProgress
              currentSegment={segmentedProgress}
              totalSegments={8}
              label="Onboarding steps"
            />

            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() =>
                  setSegmentedProgress(Math.max(0, segmentedProgress - 1))
                }
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-foundation-content-body)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Previous step
              </button>
              <button
                onClick={() =>
                  setSegmentedProgress(Math.min(8, segmentedProgress + 1))
                }
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-blue-500)',
                  color: 'var(--sc-color-white)',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Next step
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Glyph symbol style */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '8px',
          }}
        >
          Glyph symbol style
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Space is limited or visual emphasis needed. Radial representation of
          completion from 0–100% with label beside the circle icon.
        </p>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Neutral variants */}
            <div>
              <h4
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Neutral
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <GlyphProgress progress={0} intent="neutral" />
                <GlyphProgress progress={20} intent="neutral" />
                <GlyphProgress progress={40} intent="neutral" />
                <GlyphProgress progress={60} intent="neutral" />
                <GlyphProgress progress={80} intent="neutral" />
                <GlyphProgress progress={100} intent="neutral" />
              </div>
            </div>

            {/* Error variants */}
            <div>
              <h4
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Error
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <GlyphProgress progress={0} intent="error" />
                <GlyphProgress progress={20} intent="error" />
                <GlyphProgress progress={40} intent="error" />
                <GlyphProgress progress={60} intent="error" />
                <GlyphProgress progress={80} intent="error" />
                <GlyphProgress progress={100} intent="error" />
              </div>
            </div>

            {/* Success variants */}
            <div>
              <h4
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '12px',
                }}
              >
                Success
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <GlyphProgress progress={100} intent="success" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Percentage only style */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '8px',
          }}
        >
          Percentage only style
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Precision matters or space is tiny. Best for metrics, table data.
        </p>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <PercentageOnly progress={glyphProgress} label="CPU usage" />
            <PercentageOnly progress={85} label="Memory" />
            <PercentageOnly progress={42} />
          </div>
        </div>
      </section>

      {/* Full circle style */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '8px',
          }}
        >
          Full circle style
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Use best for dashboards, summaries or loading screens. Radial
          representation of completion from 0–100% with label inside the circle.
        </p>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <CircularProgress
              progress={circularProgress}
              label="Dashboard metric"
            />

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() =>
                  setCircularProgress(Math.max(0, circularProgress - 10))
                }
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-white)',
                  color: 'var(--sc-color-foundation-content-body)',
                  border: '1px solid var(--sc-color-grey-300)',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Decrease
              </button>
              <button
                onClick={() =>
                  setCircularProgress(Math.min(100, circularProgress + 10))
                }
                style={{
                  height: '32px',
                  padding: '0 16px',
                  backgroundColor: 'var(--sc-color-blue-500)',
                  color: 'var(--sc-color-white)',
                  border: 'none',
                  borderRadius: '24px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Increase
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Intent states */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '8px',
          }}
        >
          Intent states
        </h3>
        <p
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: 'var(--sc-color-foundation-content-helper-text)',
            marginBottom: '16px',
          }}
        >
          Progress indicators support neutral, success and error intents across
          all styles.
        </p>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-layer)',
            borderRadius: '8px',
            border: '1px solid var(--sc-color-foundation-basic-divider-base)',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
          >
            {/* Bar intents */}
            <div>
              <h4
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '16px',
                }}
              >
                Bar
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <LinearProgress
                  progress={75}
                  label="Neutral"
                  intent="neutral"
                />
                <LinearProgress
                  progress={100}
                  label="Success"
                  intent="success"
                />
                <LinearProgress progress={30} label="Error" intent="error" />
              </div>
            </div>

            {/* Segmented intents */}
            <div>
              <h4
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '16px',
                }}
              >
                Segmented bar
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <SegmentedProgress
                  currentSegment={3}
                  totalSegments={5}
                  label="Neutral"
                  intent="neutral"
                />
                <SegmentedProgress
                  currentSegment={5}
                  totalSegments={5}
                  label="Success"
                  intent="success"
                />
                <SegmentedProgress
                  currentSegment={2}
                  totalSegments={5}
                  label="Error"
                  intent="error"
                />
              </div>
            </div>

            {/* Glyph intents */}
            <div>
              <h4
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '16px',
                }}
              >
                Glyph symbol
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <GlyphProgress progress={75} label="Neutral" intent="neutral" />
                <GlyphProgress
                  progress={100}
                  label="Success"
                  intent="success"
                />
                <GlyphProgress progress={30} label="Error" intent="error" />
              </div>
            </div>

            {/* Percentage only intents */}
            <div>
              <h4
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '16px',
                }}
              >
                Percentage only
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <PercentageOnly
                  progress={75}
                  label="Neutral"
                  intent="neutral"
                />
                <PercentageOnly
                  progress={100}
                  label="Success"
                  intent="success"
                />
                <PercentageOnly progress={30} label="Error" intent="error" />
              </div>
            </div>

            {/* Circle intents */}
            <div>
              <h4
                style={{
                  fontSize: 'var(--sc-text-label-main)',
                  lineHeight: '16px',
                  color: 'var(--sc-color-foundation-content-label-text)',
                  marginBottom: '16px',
                }}
              >
                Full circle
              </h4>
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <CircularProgress progress={75} intent="neutral" size={80} />
                <CircularProgress progress={100} intent="success" size={80} />
                <CircularProgress progress={30} intent="error" size={80} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

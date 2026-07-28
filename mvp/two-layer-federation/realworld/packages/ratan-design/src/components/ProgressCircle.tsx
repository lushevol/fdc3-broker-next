import {
  ProgressBar,
  type ProgressBarProps,
} from 'react-aria-components';

export interface ProgressCircleProps {
  readonly label: string;
  readonly value?: number;
  readonly className?: string;
}

export function ProgressCircle({
  label,
  value,
  className,
}: ProgressCircleProps) {
  const progressProps: ProgressBarProps = value === undefined
    ? { 'aria-label': label, isIndeterminate: true }
    : { 'aria-label': label, value, minValue: 0, maxValue: 100 };
  return (
    <ProgressBar
      {...progressProps}
      className={['ratan-progress-circle', className].filter(Boolean).join(' ')}
      data-indeterminate={value === undefined || undefined}
      data-ratan-component="progress-circle"
    >
      {({ percentage, isIndeterminate }) => (
        <>
          <svg aria-hidden="true" viewBox="0 0 32 32">
            <circle className="ratan-progress-track" cx="16" cy="16" r="13" />
            <circle
              className="ratan-progress-value"
              cx="16"
              cy="16"
              r="13"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={isIndeterminate ? 68 : 100 - Number(percentage)}
            />
          </svg>
          <span className="ratan-visually-hidden">{label}</span>
        </>
      )}
    </ProgressBar>
  );
}

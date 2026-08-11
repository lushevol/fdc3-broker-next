import { useCallback, useRef, useState } from 'react';

export type RatanChangeReason =
  | 'clear'
  | 'dismiss'
  | 'input'
  | 'press'
  | 'programmatic'
  | 'reset'
  | 'selection';

export interface RatanChangeDetail<Value> {
  readonly value: Value;
  readonly previousValue: Value;
  readonly reason: RatanChangeReason;
  readonly trigger?: Event;
}

export type RatanStateUpdater<Value> = Value | ((previousValue: Value) => Value);

export interface ControllableStateOptions<Value> {
  readonly value?: Value;
  readonly defaultValue: Value;
  readonly onChange?: (detail: RatanChangeDetail<Value>) => void;
}

export type SetControllableState<Value> = (
  nextValue: RatanStateUpdater<Value>,
  reason?: RatanChangeReason,
  trigger?: Event,
) => void;

export interface ControllableState<Value> {
  readonly value: Value;
  readonly setValue: SetControllableState<Value>;
  readonly isControlled: boolean;
}

export function createRatanChangeDetail<Value>(
  value: Value,
  previousValue: Value,
  reason: RatanChangeReason,
  trigger?: Event,
): RatanChangeDetail<Value> {
  return {
    value,
    previousValue,
    reason,
    ...(trigger ? { trigger } : {}),
  };
}

export function useControllableState<Value>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<Value>): ControllableState<Value> {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = value ?? uncontrolledValue;
  const currentValueRef = useRef(currentValue);
  currentValueRef.current = currentValue;

  const setValue = useCallback<SetControllableState<Value>>(
    (nextValue, reason = 'programmatic', trigger) => {
      const previousValue = currentValueRef.current;
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (previousValue: Value) => Value)(previousValue)
          : nextValue;
      if (Object.is(previousValue, resolvedValue)) return;
      currentValueRef.current = resolvedValue;
      if (!isControlled) setUncontrolledValue(resolvedValue);
      onChange?.(
        createRatanChangeDetail(resolvedValue, previousValue, reason, trigger),
      );
    },
    [isControlled, onChange],
  );

  return { value: currentValue, setValue, isControlled };
}

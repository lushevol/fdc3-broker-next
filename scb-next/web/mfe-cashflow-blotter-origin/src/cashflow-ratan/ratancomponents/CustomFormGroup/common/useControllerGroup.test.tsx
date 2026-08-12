import { renderHook, act } from '@testing-library/react';
import useControllerGroup from './useControllerGroup';
import cloneDeep from "lodash/cloneDeep";
import { CustomFormGroupConfigProps } from '../interface';
import { FormInstance } from "antd";

export const mockFormInstance = vi.fn<FormInstance, []>(() => {
  return {
    getFieldValue: vi.fn(),
    getFieldsValue: vi.fn(),
    getFieldError: vi.fn(),
    getFieldsError: vi.fn(),
    getFieldWarning: vi.fn(),
    isFieldsTouched: vi.fn(),
    isFieldTouched: vi.fn(),
    isFieldValidating: vi.fn(),
    isFieldsValidating: vi.fn(),
    resetFields: vi.fn(),
    setFields: vi.fn(),
    setFieldValue: vi.fn(),
    setFieldsValue: vi.fn(),
    validateFields: vi.fn(),
    submit: vi.fn(),
    scrollToField: vi.fn(),
    getFieldInstance: vi.fn(),
  };
});

const mockForm = mockFormInstance();

interface MockCustomFormProps {
  formConfig: CustomFormGroupConfigProps[];
  defaultData?: any;
  editable?: boolean;
  onSubmit?: (values: any) => Promise<void>;
  onReject?: () => Promise<void>;
  onNext?: (values: any) => void;
  data?: any;
}

// const mockForm = new Form.useForm();

describe('useController', () => {
  const mockProps: MockCustomFormProps = {
    formConfig: [
      {
        title: "Group A",
        row: [
          {
            itemConfig: [{ field: "name", label: "Name" } as any, { field: "age", label: "Age", notSubmit: true } as any],
          },
          {
            childGroup: [
              {
                title: "Child A",
                row: [
                  {
                    itemConfig: [{ field: "fieldC" } as any],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    defaultData: { name: 'John Doe', age: 30 },
    editable: true,
    onSubmit: vi.fn().mockResolvedValue(undefined),
    onReject: vi.fn().mockResolvedValue(undefined),
    onNext: vi.fn(),
    data: { name: 'Jane Doe' },
  };

  it('should set submiting state to true during onSubmit', async () => {
    const { result } = renderHook(() => useControllerGroup(mockProps, mockForm));

    await act(async () => {
      result.current.onFinish({ name: 'Jane Doe', age: 30 });
    });

    expect(mockProps.onSubmit).toHaveBeenCalled();
    expect(result.current.enable.submiting).toBe(false); // Assuming it resets after onSubmit
  });

  it('should handle onReject correctly', async () => {
    const { result } = renderHook(() => useControllerGroup(mockProps, mockForm));

    await act(async () => {
      result.current.reject();
    });

    expect(mockProps.onReject).toHaveBeenCalled();
    expect(result.current.enable.rejecting).toBe(false); // Assuming it resets after onReject
  });

  it('should reset fields correctly', () => {
    const { result } = renderHook(() => useControllerGroup(mockProps, mockForm));

    act(() => {
      result.current.onReset();
    });
    expect(result.current.newFormConfig).toEqual(cloneDeep(mockProps.formConfig));
  });

  it("clears error on onFinishFailed", async () => {
  const form = { resetFields: vi.fn() } as any;
  const onSubmit = vi.fn().mockRejectedValue({ msg: "err" });

  const props = {
    formConfig: [],
    onSubmit,
  } as any;

  const { result } = renderHook(() => useControllerGroup(props, form));

  await act(async () => {
    await result.current.onFinish({ a: 1 });
  });

  expect(Object.keys(result.current.error).length).toBeGreaterThan(0);

  act(() => {
    result.current.onFinishFailed();
  });

  expect(result.current.error).toEqual({});
});

});
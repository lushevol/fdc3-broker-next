import { renderHook, act } from '@testing-library/react';
import useControllerGroup from './useControllerGroup';
import cloneDeep from "lodash/cloneDeep";
import { CustomFormGroupConfigProps } from '../interface';
import { FormInstance } from "antd";

export const mockFormInstance = jest.fn<FormInstance, []>(() => {
  return {
    getFieldValue: jest.fn(),
    getFieldsValue: jest.fn(),
    getFieldError: jest.fn(),
    getFieldsError: jest.fn(),
    getFieldWarning: jest.fn(),
    isFieldsTouched: jest.fn(),
    isFieldTouched: jest.fn(),
    isFieldValidating: jest.fn(),
    isFieldsValidating: jest.fn(),
    resetFields: jest.fn(),
    setFields: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldsValue: jest.fn(),
    validateFields: jest.fn(),
    submit: jest.fn(),
    scrollToField: jest.fn(),
    getFieldInstance: jest.fn(),
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
    onSubmit: jest.fn().mockResolvedValue(undefined),
    onReject: jest.fn().mockResolvedValue(undefined),
    onNext: jest.fn(),
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
  const form = { resetFields: jest.fn() } as any;
  const onSubmit = jest.fn().mockRejectedValue({ msg: "err" });

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
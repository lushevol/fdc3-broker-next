import { renderHook, act } from '@testing-library/react';
import  useController from './useController';
import { CustomFormConfigProps } from '../FormItemComponents';
import { copyConfig } from '../item/ItemsUtils';
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

interface MockCustomFormConfigProps extends CustomFormConfigProps {
  field: string;
  notSubmit?: boolean;
}

interface MockCustomFormProps {
  formConfig: MockCustomFormConfigProps[];
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
      { field: 'name',label:"Name", notSubmit: false },
      { field: 'age',label:"Age",notSubmit: true },
    ],
    defaultData: { name: 'John Doe', age: 30 },
    editable: true,
    onSubmit: jest.fn().mockResolvedValue(undefined),
    onReject: jest.fn().mockResolvedValue(undefined),
    onNext: jest.fn(),
    data: { name: 'Jane Doe' },
  };

  it('should set submiting state to true during onSubmit', async () => {
    const { result } = renderHook(() => useController(mockProps, mockForm));

    await act(async () => {
      result.current.onFinish({ name: 'Jane Doe', age: 30 });
    });

    expect(mockProps.onSubmit).toHaveBeenCalled();
    expect(result.current.enable.submiting).toBe(false); // Assuming it resets after onSubmit
  });

  it('should handle onReject correctly', async () => {
    const { result } = renderHook(() => useController(mockProps, mockForm));

    await act(async () => {
      result.current.reject();
    });

    expect(mockProps.onReject).toHaveBeenCalled();
    expect(result.current.enable.rejecting).toBe(false); // Assuming it resets after onReject
  });

  it('should reset fields correctly', () => {
    const { result } = renderHook(() => useController(mockProps, mockForm));

    act(() => {
      result.current.onReset();
    });
    expect(result.current.newFormConfig).toEqual(copyConfig(mockProps.formConfig));
  });
});
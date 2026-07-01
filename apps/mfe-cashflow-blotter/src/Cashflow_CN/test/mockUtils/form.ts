export const mockFormInstanceOfVostro = jest.fn(({ formData }) => {
  return {
    getFieldsValue: () => formData,
  };
});

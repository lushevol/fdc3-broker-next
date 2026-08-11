export const buttonAttribute: any = (editable, onFinish) => {
  return editable ? { type: "submit" } : { onClick: () => onFinish({}) };
};

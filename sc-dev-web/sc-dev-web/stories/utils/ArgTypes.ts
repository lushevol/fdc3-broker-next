

export const truncateArgType = (more?: object)=>({
  truncate: {
    control: 'boolean',
    description: 'Restricts the maximum width to the container and truncates any overflowing text with an ellipsis.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
    ...more ?? {},
  },
});
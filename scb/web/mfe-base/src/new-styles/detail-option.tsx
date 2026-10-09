import React from 'react';
import { Box } from 'ratan-design-origin/primitives';

/** Preserve the legacy option image/text while forwarding React's key explicitly. */
export function renderDetailOption(
  props: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key },
  option: string,
  hiddenImage?: boolean,
) {
  const { key, ...optionProps } = props;
  return (
    <Box key={key} component="li"
      sx={{ height: '50px', mt: 1, mb: 1, '& > img': { mr: 2, flexShrink: 0 } }}
      {...optionProps}>
      <img loading="lazy" width="50px" srcSet={`${option} 2x`}
        src={`/image/${option}`} alt={option} hidden={hiddenImage} />
      {option}
    </Box>
  );
}

import * as React from 'react';
import { Stack as Stack } from "ratan-design-origin/primitives";
import { Button as Button } from "ratan-design-origin/primitives";

export default function BasicButtons() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Stack>
  );
}
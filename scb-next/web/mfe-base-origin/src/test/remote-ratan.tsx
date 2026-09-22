import React from 'react';

interface RemoteRatanStubProps {
  appearance?: {
    mode?: string;
    designGeneration?: string;
  };
}

export default function RemoteRatanStub({ appearance }: RemoteRatanStubProps) {
  return (
    <div
      data-testid="remote-ratan-stub"
      data-mode={appearance?.mode}
      data-generation={appearance?.designGeneration}
    />
  );
}

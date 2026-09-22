interface RemoteCashflowFixtureProps {
  appearance?: {
    mode?: string;
    designGeneration?: string;
  };
}

export default function RemoteCashflowFixture({ appearance }: RemoteCashflowFixtureProps) {
  return (
    <div
      data-testid="remote-cashflow"
      data-mode={appearance?.mode}
      data-generation={appearance?.designGeneration}
    >
      Cashflow remote fixture
    </div>
  );
}

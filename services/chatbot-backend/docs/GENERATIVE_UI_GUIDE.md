# Generative Component Creation Guide

This guide explains how to create custom generative UI components for the chatbot.

## Overview

Generative UI components are React components that the AI can render dynamically within chat messages. This allows the assistant to display rich, interactive content beyond plain text.

## Component Structure

A generative component is a standard React component that receives a `props` object:

```tsx
interface GenerativeComponentProps {
  props: Record<string, unknown>;
}

const MyComponent: React.FC<GenerativeComponentProps> = ({ props }) => {
  const { title, description } = props as { title: string; description: string };

  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
```

## Creating a Custom Component

### 1. Define the TypeScript Interface

```typescript
// In common/interface.ts
export interface StockCardProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}
```

### 2. Create the Component

```tsx
// In common/GenerativeComponents/StockCard.tsx
import React from 'react';
import { useTheme, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StockCardProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export const StockCard: React.FC<{ props: StockCardProps }> = ({ props }) => {
  const theme = useTheme();
  const { symbol, price, change, changePercent } = props;

  const isPositive = change >= 0;
  const color = isPositive ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Box sx={{
      p: 2,
      borderRadius: 2,
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      minWidth: 200,
    }}>
      <Typography variant="h6" fontWeight="bold">
        {symbol}
      </Typography>
      <Typography variant="h4">
        ${price.toFixed(2)}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color }}>
        {isPositive ? <TrendingUp /> : <TrendingDown />}
        <Typography>
          {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
        </Typography>
      </Box>
    </Box>
  );
};
```

### 3. Register the Component

```tsx
// Where you set up your GenerativeUIProvider
import { StockCard } from './common/GenerativeComponents/StockCard';

const generativeComponents = [
  { name: 'StockCard', component: StockCard as React.ComponentType<{ props: Record<string, unknown> }> },
  // ... other components
];

<GenerativeUIProvider initialComponents={generativeComponents}>
  <ChatbotSidebar />
</GenerativeUIProvider>
```

## Interactive Components

Components can handle user interactions and trigger follow-up actions:

```tsx
export const ActionCard: React.FC<{ props: ActionCardProps; onAction?: (action: string, data: unknown) => void }> = ({
  props,
  onAction
}) => {
  const { title, actionLabel, actionData } = props;

  const handleClick = () => {
    if (onAction) {
      onAction('click', actionData);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography>{title}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleClick}>{actionLabel}</Button>
      </CardActions>
    </Card>
  );
};
```

## Backend Integration

The AI returns component directives that the frontend renders:

```json
{
  "type": "generative_ui",
  "component": "StockCard",
  "props": {
    "symbol": "AAPL",
    "price": 175.50,
    "change": 2.30,
    "changePercent": 1.33
  }
}
```

## Best Practices

### 1. Use TypeScript Types

```tsx
interface Props {
  title: string;
  items: Array<{ id: string; name: string }>;
  onItemSelect?: (id: string) => void;
}

export const TypedComponent: React.FC<{ props: Props }> = ({ props }) => {
  // TypeScript will validate props usage
};
```

### 2. Handle Missing Props Gracefully

```tsx
export const SafeComponent: React.FC<{ props: Partial<Props> }> = ({ props }) => {
  const title = props.title ?? 'Default Title';
  const items = props.items ?? [];

  return (
    <div>
      <h2>{title}</h2>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
};
```

### 3. Use MUI for Consistent Styling

```tsx
import { useTheme, styled } from '@mui/material';

const StyledCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
}));
```

### 4. Keep Components Simple

Each component should do one thing well. Complex UIs can be composed of multiple components.

### 5. Test Your Components

```tsx
import { render, screen } from '@testing-library/react';
import { StockCard } from './StockCard';

describe('StockCard', () => {
  it('renders stock information', () => {
    render(
      <StockCard
        props={{
          symbol: 'AAPL',
          price: 175.50,
          change: 2.30,
          changePercent: 1.33,
        }}
      />
    );

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText(/\$175.50/)).toBeInTheDocument();
  });

  it('shows negative change in red', () => {
    render(
      <StockCard
        props={{
          symbol: 'AAPL',
          price: 175.50,
          change: -2.30,
          changePercent: -1.33,
        }}
      />
    );

    // Check for negative indicator
    expect(screen.getByText(/-2.30/)).toBeInTheDocument();
  });
});
```

## Component Categories

### Display Components

- `Card` - Simple content display
- `Table` - Tabular data
- `List` - Item collections
- `Status` - Status indicators

### Interactive Components

- `Form` - Dynamic forms with validation
- `Button` - Action buttons
- `Select` - Dropdown selections

### Data Components

- `Chart` - Data visualizations
- `StockCard` - Stock price display
- `WeatherCard` - Weather information

## Example: Weather Card

```tsx
interface WeatherCardProps {
  location: string;
  temperature: number;
  conditions: string;
  humidity: number;
  icon?: string;
}

export const WeatherCard: React.FC<{ props: WeatherCardProps }> = ({ props }) => {
  const theme = useTheme();
  const { location, temperature, conditions, humidity, icon } = props;

  return (
    <Box sx={{
      p: 2,
      borderRadius: 2,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minWidth: 200,
    }}>
      <Typography variant="subtitle1">{location}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon && <span style={{ fontSize: 48 }}>{icon}</span>}
        <Typography variant="h3">{temperature}°C</Typography>
      </Box>
      <Typography variant="body1">{conditions}</Typography>
      <Typography variant="body2">Humidity: {humidity}%</Typography>
    </Box>
  );
};
```

## Registering Multiple Components

```tsx
import { CardComponent } from './Card';
import { ListComponent } from './List';
import { TableComponent } from './Table';
import { StatusComponent } from './Status';
import { ErrorComponent } from './Error';
import { FormComponent } from './Form';
import { StockCard } from './StockCard';
import { WeatherCard } from './WeatherCard';

export const customGenerativeComponents: GenerativeComponentEntry[] = [
  { name: 'Card', component: CardComponent },
  { name: 'List', component: ListComponent },
  { name: 'Table', component: TableComponent },
  { name: 'Status', component: StatusComponent },
  { name: 'Error', component: ErrorComponent },
  { name: 'Form', component: FormComponent },
  { name: 'StockCard', component: StockCard },
  { name: 'WeatherCard', component: WeatherCard },
];
```
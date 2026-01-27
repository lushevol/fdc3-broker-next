# MFE Next

## Getting Started

### Prerequisites

- Node.js 20+ (npm included)

### Installation

```bash
npm install
```

### Commands

- **Build**: `npm run build`
- **Test**: `npm run test`
- **Lint**: `npm run lint`
- **Dev**: `npm run dev`

### Monorepo Management

This project uses **npm workspaces** and **Turbo**.

- List packages: `npm query ".workspace"`
- Run command in all packages: `npm run <command>` (turbo orchestrates)

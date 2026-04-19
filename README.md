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

### Windows Support

This project supports both macOS/Linux and Windows. The scripts use `cross-env` for cross-platform environment variable handling.

- All npm scripts work on Windows (e.g., `npm run dev`, `npm run stop`)
- The `stop` script uses a Node.js script instead of Unix commands

Note: Some deployment scripts (`bundle:centos`, `verify:protocol:real`) require bash and are for Linux server deployment only.

### Monorepo Management

This project uses **npm workspaces** and **Turbo**.

- List packages: `npm query ".workspace"`
- Run command in all packages: `npm run <command>` (turbo orchestrates)

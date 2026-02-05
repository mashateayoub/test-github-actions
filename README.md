# test-github-actions

This is a Turborepo-powered monorepo containing a NestJS API and two Next.js web applications.

## What's inside?

This monorepo includes the following applications and packages:

### Apps

- `api`: A [NestJS](https://nestjs.com/) API.
- `web`: A [Next.js](https://nextjs.org/) web application (running on port 3000).
- `docs`: A [Next.js](https://nextjs.org/) documentation site (running on port 3001).
- `database`: A custom PostgreSQL setup with seeded data for development.

### Packages

- `@repo/ui`: A shared React component library used by both `web` and `docs`.
- `@repo/eslint-config`: Shared `eslint` configurations.
- `@repo/typescript-config`: Shared `tsconfig.json` files used throughout the monorepo.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Development

### Setup

Install dependencies from the root:

```sh
npm install
```

### Local Development

To run all apps in development mode:

```sh
npm run dev
```

### Docker Development (Recommended)

To build and start all services, including the PostgreSQL database:

```sh
docker compose up --build
```

- **API**: `http://localhost:4000/data`
- **Web**: `http://localhost:3000`
- **Docs**: `http://localhost:3001`
- **DB**: Port `5432`

### Build

To build all apps and packages for production:

```sh
npm run build
```

### Type Checking

To run type checking across the entire monorepo:

```sh
npm run check-types
```

### Linting

To lint all packages:

```sh
npm run lint
```

## Remote Caching

Turborepo can use [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share build artifacts across machines.

To authenticate with Vercel and link your repo:

```sh
npx turbo login
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)

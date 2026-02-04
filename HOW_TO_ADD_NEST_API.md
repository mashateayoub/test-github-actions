# How to Add a NestJS API to the Monorepo

This guide outlines the steps to add a new NestJS API application to this Turborepo project.

## Prerequisites

- [Nest CLI](https://docs.nestjs.com/cli/overview) installed globally:
  ```bash
  npm install -g @nestjs/cli
  ```

## 1. Initialize the NestJS Project

Navigate to the project root and use the Nest CLI to create a new application inside the `apps/` directory.

```bash
cd apps
nest new api
```

> [!NOTE]
> When prompted, choose `npm` as the package manager to stay consistent with the rest of the project.

## 2. Refactor for Monorepo Compatibility

To ensure the new API works seamlessly with Turborepo and shares configurations, follow these steps:

### Update `package.json`
Open `apps/api/package.json` and update the following:

- **Name**: Change the name to `@repo/api` (or simply `api` if you prefer, but `@repo/` prefix is common in monorepos).
- **Scripts**: Ensure you have a `dev` script that Turbo can call. Nest usually provides `start:dev`, so you can alias it:
  ```json
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "nest start"
  }
  ```

### Link Shared Configurations
If you want to use the shared TypeScript configuration from `packages/typescript-config`:

1. Add it as a devDependency in `apps/api/package.json`:
   ```bash
   npm install @repo/typescript-config --save-dev -w api
   ```
2. Update `apps/api/tsconfig.json` to extend the shared config:
   ```json
   {
     "extends": "@repo/typescript-config/base.json",
     "compilerOptions": {
       "outDir": "./dist",
       "baseUrl": "./"
     },
     "include": ["src/**/*"]
   }
   ```

## 3. Implement the GET Endpoint

By default, Nest provides an `AppController`. You can modify it to serve your data.

### Example: `apps/api/src/app.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('data')
  getData() {
    return {
      message: 'Hello from the NestJS API!',
      timestamp: new Date().toISOString(),
      data: [1, 2, 3, 4, 5]
    };
  }
}
```

## 4. Running the API

You can now run the API directly or via Turbo from the project root.

**Using Turbo (Recommended):**
```bash
npm run dev --filter=@repo/api
```

**Directly:**
```bash
cd apps/api
npm run dev
```

The API will be available at `http://localhost:3000` (or the port defined in `main.ts`).

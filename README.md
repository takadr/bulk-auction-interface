# bulk-auction-interface

### Build

```bash
pnpm build
```

### Develop

```bash
pnpm dev
```

#### with specific .env file

```bash
npx env-cmd -f .env.development.goerli pnpm dev
```

### E2E Test with Synpress

```bash
cd apps/web
npx env-cmd -f ../../.env npm run test:headless
```

- Comment out BASIC_AUTH_USER and BASIC_AUTH_PASS in your .env while e2e test

### How to add templates

1. Add template name to packages/lib/constants/templates.ts

2. Create a derectly under packages/ui/components/templates and packages/ui/hooks

3. Add components and hooks as needed

4. Add switch conditions to the following files

- packages/ui/components/AuctionCard.tsx
- packages/ui/components/templates/AuctionDetail.tsx
- packages/ui/components/templates/AuctionFormWrapper.tsx

## Subgraph

### deploy

```bash
cd subgraph
graph codegen && graph build
graph deploy --studio SUBGRAPH_NAME
```

### test

```bash
cd subgraph
graph test
```

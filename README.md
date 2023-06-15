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
npm run test:headless
```

* Comment out BASIC_AUTH_USER and BASIC_AUTH_PASS in your .env while e2e test

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
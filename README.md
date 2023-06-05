# bulk-auction-interface

### Build

```
pnpm build
```

### Develop

```
pnpm dev
```

#### with specific .env file

```
npx env-cmd -f .env.development.goerli pnpm dev
```

## Subgraph

### deploy
```
cd subgraph
graph codegen && graph build
graph deploy --studio SUBGRAPH_NAME
```

### test
```
cd subgraph
graph test
```
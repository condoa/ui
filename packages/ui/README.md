# @condoa/ui

A zero-dependency CLI that installs Condoa UI registry components into your project. It fetches versioned, self-contained Vue components (with their icons, tokens, and cross-component dependencies) from the Condoa app's hosted registry and writes them into your source tree.

## Quick start

```bash
npx @condoa/ui add button
```

This resolves `button` plus its registry dependencies, fetches each component from the registry, and writes the files under your target root (default `resources/js`).

## Commands

### `init`

Create a `components.json` in the current directory.

```bash
npx @condoa/ui init
npx @condoa/ui init --yes                 # accept defaults, no prompts
npx @condoa/ui init --registry https://condoa.com.br/registry --yes
```

Interactive mode prompts for the registry URL and target directory. `--yes` writes the defaults.

### `add`

Install one or more components and their transitive dependencies.

```bash
npx @condoa/ui add button card dialog
npx @condoa/ui add button --dry-run       # print the plan, write nothing
npx @condoa/ui add button --force         # overwrite locally modified files
npx @condoa/ui add button --registry https://condoa.com.br/registry --target src
```

A locally modified file is skipped (never silently overwritten) unless you pass `--force`. After a successful install, a `registry.lock.json` is written with the resolved version and component set.

### `list`

Print the available components.

```bash
npx @condoa/ui list
npx @condoa/ui list --json                # raw manifest items as JSON
```

## components.json

`init` writes a config the other commands read:

```json
{
  "registry": "https://condoa.com.br/registry",
  "target": "resources/js",
  "lock": "registry.lock.json"
}
```

- `registry`: the base registry URL. The CLI appends `/index.json` and `/r/{name}.json`. Point this at your deployed app's `/registry` (for example `https://app.example.com/registry`).
- `target`: the consumer's `@/` root. A component whose canonical path is `common/components/ui/Button.vue` lands at `<target>/common/components/ui/Button.vue`.
- `lock`: where the install lock is written (relative to the current directory).

Flags override config values per run (`--registry`, `--target`).

## Hosting the registry

The registry is served by the Condoa app at `/registry`:

- `GET /registry/index.json` - the manifest (component list and dependency graph).
- `GET /registry/r/{name}.json` - one component with its file contents at canonical paths.

The app streams built files from `registry/dist`, so any deploy that serves the registry must run the build first:

```bash
npm run registry:build
```

If `registry/dist` is missing, the routes respond with 503 and a "run registry:build" message. Local dev servers often use a self-signed HTTPS certificate that Node's `fetch` rejects; point `--registry` at a trusted HTTPS host in real use, or set `NODE_EXTRA_CA_CERTS` to your local CA bundle for local testing.

## Requirements

Node >= 18 (the CLI uses the built-in global `fetch`). No runtime dependencies.

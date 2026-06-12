# condoa/ui

A self-contained, isolation-verified Vue 3 component registry of 100+
components, built on reka-ui and tailwind-variants. Each component ships with
its own dependencies and base files, so you install only what you use.

## Install a component

```bash
npx @condoa/ui add button
```

The CLI copies the component, its base files, and any registry dependencies
into your project, then prints the npm packages you still need to install.

## Build the registry

```bash
npm run registry:build
```

This regenerates `registry/index.json` and `registry/items/*.json` from the
component sources. The manifest is committed, so the registry is usable without
a build, but rebuild after editing any component.

## Run the tests

```bash
npm install
npm test
```

The suite includes the per-component isolation gate that proves every component
resolves without reaching outside the registry.

## Repository layout

The tree mirrors the relative paths of the upstream Condoa application so the
path-coupled tooling and tests run unchanged:

- `resources/js/common/components/ui/` the component families and their
  `.llm.txt` docs.
- `resources/js/common/components/Icon.vue`, `resources/js/common/helpers/cn.ts`
  the shared base.
- `resources/js/scripts/registry/` the build, install, and isolation tooling.
- `resources/svg/` the icon SVGs.
- `resources/css/app.css` the theme source (only its theme blocks are read by
  the build).
- `tests/js/registry/` the registry test suite.
- `packages/ui/` the `@condoa/ui` install CLI.
- `registry/` the committed manifest.

Flattening the `resources/js/...` paths to clean OSS paths is a planned
follow-up.

## Contributing

The source of truth is the Condoa application. This repository is regenerated
from it by an extract script, so changes land in the app first and then sync
here. Open issues and pull requests, but expect accepted changes to be applied
upstream and synced back, rather than committed directly to this tree.

## License

MIT

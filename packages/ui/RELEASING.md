# Releasing @condoa/ui

The package is publish-ready. Publishing is a manual, outward-facing step you run with your own npm account. These are the steps; nothing here has been published.

## One-time setup

1. The package is scoped `@condoa`. On npmjs.com, create the `condoa` org (or user scope) if it does not exist and confirm you have publish rights. Scoped packages published with public access are free.
2. `npm login` locally (or set an `NPM_TOKEN` automation token in CI).

`package.json` already sets `"publishConfig": { "access": "public" }`, so no `--access public` flag is needed.

## Publish the current version

From `packages/ui/`:

```bash
npm publish
```

`prepublishOnly` runs `node --test` first, so a failing test blocks the publish. The dry-run has been verified:

```bash
npm publish --dry-run   # packs 11 files, ~6 kB, runs the tests, public access
```

## Verify after publishing

```bash
npm view @condoa/ui
npx @condoa/ui@latest list --registry https://<your-app-domain>/registry
```

## Make the host live

The CLI fetches from the app's `/registry` routes, which stream from `registry/dist`. Any deploy that serves the registry must build it:

```bash
npm run registry:build
```

If `registry/dist` is absent the routes return 503. Point consumers' `components.json` `registry` at the deployed `https://<your-app-domain>/registry`.

## Subsequent releases

1. `npm version patch|minor|major` (bumps `package.json` and tags).
2. Add a `CHANGELOG.md` entry.
3. `npm publish`.
4. `git push --follow-tags`.

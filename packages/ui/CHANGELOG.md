# Changelog

## 0.1.3

- Security: the lock now pins a SHA-256 of every installed file. A later `add` that fetches different content for the same registry `version` is rejected with an integrity error (override with `--force`), detecting a registry that silently swaps a component's bytes.

## 0.1.2

- Security: `add` now refuses to write any file whose registry-supplied path escapes the target directory (`..` traversal or absolute paths), closing an arbitrary-file-write vector when pointed at an untrusted or MITM'd registry. The guard applies even under `--force`.
- Security: registry URLs must be `https` (plaintext `http` is allowed only for loopback hosts), preventing a downgraded origin from feeding malicious file content.
- `add` falls back to the default registry (`https://condoa.com.br/registry`) when there is no `components.json`, so `npx @condoa/ui add <component>` works without running `init` first.
- Fix `homepage`, `bugs`, and `repository` to point at the public `github.com/condoa/ui` repository.

## 0.1.1

- Point the default registry at `https://condoa.com.br/registry` (0.1.0 shipped a local dev URL in the `init` default and the README examples).

## 0.1.0

Initial release.

- `init`: write a `components.json` config (registry URL, target root, lock path).
- `add <component...>`: resolve a component plus its transitive registry dependencies, fetch each from the hosted registry, and write the files into the target tree. Locally modified files are skipped unless `--force`. Supports `--dry-run`, `--registry`, and `--target`, and writes a `registry.lock.json`.
- `list`: print the available components (`--json` for raw output).
- Zero runtime dependencies. Requires Node >= 18 (built-in global `fetch`).

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

/**
 * SHA-256 hex digest of a file's content, used to pin registry payloads in the
 * lock so a later install that returns different bytes for the same version is
 * detectable.
 *
 * @param {string} content
 * @returns {string}
 */
function hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Resolve a registry-supplied file path inside the target tree, rejecting any
 * path that escapes it. file.path is untrusted (it comes from the fetched
 * registry JSON), so `..` segments and absolute paths must not be allowed to
 * write outside the target. The guard runs regardless of settings.force.
 *
 * @param {string} target
 * @param {string} filePath
 * @returns {string} the absolute destination, guaranteed within target
 */
function resolveInsideTarget(target, filePath) {
    const root = path.resolve(target)
    const dest = path.resolve(root, filePath)
    if (dest !== root && !dest.startsWith(root + path.sep)) {
        throw new Error(`refusing to write '${filePath}' outside the target directory`)
    }
    return dest
}

/**
 * Write every file of each fetched item into the target tree. An existing file
 * whose content differs is skipped (not overwritten) unless settings.force.
 *
 * @param {Array<{ files: Array<{ path: string, content: string }> }>} items
 * @param {{ target: string, force: boolean }} settings
 * @returns {{ written: string[], skipped: string[] }}
 */
export function installFiles(items, settings) {
    const written = []
    const skipped = []
    for (const item of items) {
        for (const file of item.files) {
            const dest = resolveInsideTarget(settings.target, file.path)
            if (!settings.force && fs.existsSync(dest)) {
                const existing = fs.readFileSync(dest, 'utf-8')
                if (existing !== file.content) {
                    skipped.push(file.path)
                    continue
                }
            }
            fs.mkdirSync(path.dirname(dest), { recursive: true })
            fs.writeFileSync(dest, file.content)
            written.push(file.path)
        }
    }
    return { written, skipped }
}

/**
 * Read the install lock from cwd/settings.lock. Returns null when absent or
 * unparseable so callers treat a missing/corrupt lock as "no prior install".
 *
 * @param {string} cwd
 * @param {{ lock: string }} settings
 * @returns {{ version: string, items: string[], files?: Record<string, string> } | null}
 */
export function readLock(cwd, settings) {
    const file = path.join(cwd, settings.lock)
    if (!fs.existsSync(file)) {
        return null
    }
    try {
        return JSON.parse(fs.readFileSync(file, 'utf-8'))
    } catch {
        return null
    }
}

/**
 * Guard against a registry silently changing a component's bytes under the same
 * version (trust-on-first-use pinning). For each fetched file already recorded
 * in the prior lock at the same version, the content hash must match. A version
 * bump is a legitimate change and skips the check, as does settings.force.
 *
 * @param {{ version: string, files?: Record<string, string> } | null} existingLock
 * @param {string} manifestVersion
 * @param {Array<{ files: Array<{ path: string, content: string }> }>} items
 * @param {boolean} force
 * @returns {void}
 */
export function verifyIntegrity(existingLock, manifestVersion, items, force) {
    if (force || !existingLock || existingLock.version !== manifestVersion) {
        return
    }
    const locked = existingLock.files ?? {}
    for (const item of items) {
        for (const file of item.files) {
            const pinned = locked[file.path]
            if (pinned && pinned !== hashContent(file.content)) {
                throw new Error(
                    `integrity check failed for '${file.path}': the registry returned different ` +
                        `content for version ${manifestVersion} than what is pinned in the lock. ` +
                        `Re-run with --force to accept the new content.`,
                )
            }
        }
    }
}

/**
 * Write the install lock (version + sorted items + per-file content hashes) to
 * cwd/settings.lock. The hashes pin what was installed so future installs can
 * detect tampering via verifyIntegrity.
 *
 * @param {string} cwd
 * @param {{ lock: string }} settings
 * @param {{ version: string, items: string[], files?: Array<{ path: string, content: string }> }} lock
 * @returns {string} the absolute path written
 */
export function writeLock(cwd, settings, lock) {
    const file = path.join(cwd, settings.lock)
    const files = {}
    for (const entry of lock.files ?? []) {
        files[entry.path] = hashContent(entry.content)
    }
    const payload = {
        version: lock.version,
        items: [...lock.items].sort(),
        files,
    }
    fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`)
    return file
}

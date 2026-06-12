import { fileURLToPath } from 'node:url'

export default {
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
}

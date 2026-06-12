<template>
    <Primitive data-slot="card" :as="as" :as-child="asChild" :class="styles({ class: props.class })">
        <slot>
            <slot name="header">
                <CardHeader>
                    <div class="space-y-1">
                        <slot name="title">
                            <CardTitle v-if="title" :title="title" />
                        </slot>
                        <slot name="description">
                            <CardDescription v-if="description" :description="description" />
                        </slot>
                    </div>
                    <div v-if="$slots.action">
                        <slot name="action" />
                    </div>
                </CardHeader>
            </slot>
            <CardContent v-if="content || $slots.content">
                <slot name="content">
                    <div v-html="content" />
                </slot>
            </CardContent>
            <slot name="footer" />
        </slot>
    </Primitive>
</template>

<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Title that should be displayed. Passed to the `CardTitle` component */
    title?: string
    /** Description that should be displayed. Passed to the `CardDescription` component */
    description?: string
    /**
     * Content that should be displayed. Passed to the `CardContent` component.
     *
     * @security Rendered as raw HTML via `v-html`. Pass only trusted, static, or
     * pre-sanitized markup. Never bind user-supplied input here, or use the
     * `content` slot instead (slot content is not interpreted as HTML).
     */
    content?: string
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const styles = tv({
    base: [
        'relative flex flex-col rounded-lg border bg-card not-dark:bg-clip-padding text-card-foreground shadow-xs/5',
        // Inner glow pseudo-element
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)]',
        // Light mode: subtle shadow (appears as top highlight)
        'before:shadow-[0_1px_rgba(0,0,0,0.04)]',
        // Dark mode: white top highlight
        'dark:before:shadow-[0_-1px_rgba(255,255,255,0.08)]',
    ],
})
</script>

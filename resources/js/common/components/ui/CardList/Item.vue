<template>
    <Primitive data-slot="card-list-item" :as="as" :as-child="asChild" :class="styles({ class: props.class })">
        <div class="flex items-center gap-3">
            <slot />
        </div>
        <div v-if="$slots.action" class="text-muted-foreground flex shrink-0 justify-end items-center gap-2">
            <slot name="action" />
        </div>
    </Primitive>
</template>

<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const styles = tv({
    base: 'flex w-full justify-between hover:bg-muted/25 px-4 items-center gap-8 py-2 sm:py-4',
})
</script>

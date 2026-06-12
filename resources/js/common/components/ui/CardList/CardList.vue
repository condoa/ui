<template>
    <Primitive data-slot="card-list" :as="as" :as-child="asChild" :class="styles({ class: props.class })">
        <div class="bg-background shadow-border rounded-lg">
            <div class="divide-muted divide-y [&>:first-child]:rounded-t-lg [&>:last-child]:rounded-b-lg">
                <slot />
            </div>
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
    base: 'overflow-hidden shadow-border rounded-lg w-full',
})
</script>

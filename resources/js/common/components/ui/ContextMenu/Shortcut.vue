<template>
    <Primitive data-slot="context-menu-shortcut" :as="as || 'span'" :as-child="asChild" :class="styles({ class: props.class })">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'
import { Primitive, type PrimitiveProps } from 'reka-ui'

interface Props extends PrimitiveProps {
    /**
     * The custom class(es) to add to the element
     */
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: 'ml-auto text-xs tracking-widest text-muted-foreground',
})
</script>

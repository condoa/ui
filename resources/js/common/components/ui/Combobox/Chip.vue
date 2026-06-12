<template>
    <span data-slot="combobox-chip" :class="styles({ class: props.class })">
        <slot />
        <button
            type="button"
            data-slot="combobox-chip-remove"
            :class="removeStyles()"
            :aria-label="removeLabel"
            @click="$emit('remove')"
        >
            <Icon :name="removeIcon" class="size-3.5" />
        </button>
    </span>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props {
    class?: ClassValue
    removeIcon?: string
    removeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
    removeIcon: 'icon-x',
    removeLabel: 'Remove',
})

defineEmits<{
    remove: []
}>()

const styles = tv({
    base: 'flex h-6 items-center rounded bg-accent ps-2 text-sm text-accent-foreground',
})

const removeStyles = tv({
    base: 'inline-flex h-full shrink-0 cursor-pointer items-center px-1.5 opacity-50 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100',
})
</script>

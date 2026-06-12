<template>
    <UiTableRow>
        <UiTableCell :colspan="colspan" :class="styles({ class: props.class })">
            <div data-slot="table-empty" class="flex items-center justify-center py-10">
                <slot />
            </div>
        </UiTableCell>
    </UiTableRow>
</template>

<script lang="ts" setup>
import { type ClassValue, tv } from 'tailwind-variants'

interface Props {
    colspan?: number
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { colspan: 1 })

const styles = tv({
    base: 'p-4 align-middle text-sm whitespace-nowrap text-foreground',
})
</script>

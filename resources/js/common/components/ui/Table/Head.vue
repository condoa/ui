<template>
    <th data-slot="table-head" :class="styles({ class: props.class })">
        <slot />
    </th>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: 'h-10 whitespace-nowrap px-2.5 text-left align-middle font-medium leading-none text-muted-foreground has-[[role=checkbox]]:w-px has-[[role=checkbox]]:pe-0',
})
</script>

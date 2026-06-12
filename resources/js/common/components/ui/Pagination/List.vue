<template>
    <PaginationList v-slot="{ items }" data-slot="pagination-list" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot :items="items" />
    </PaginationList>
</template>

<script lang="ts" setup>
import { reactiveOmit } from "@vueuse/core"
import type { PaginationListProps } from "reka-ui"
import { type ClassValue, tv } from "tailwind-variants"

interface Props extends PaginationListProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue;
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, "class")

const styles = tv({
    base: "flex flex-row items-center gap-1",
})
</script>

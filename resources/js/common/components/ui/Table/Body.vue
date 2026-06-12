<template>
    <tbody data-slot="table-body" :class="bodyClass">
        <slot />
    </tbody>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'
import { computed } from 'vue'

interface Props {
    class?: ClassValue;
    framed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    framed: true,
});

const bodyClass = computed(() => styles({ framed: props.framed, class: props.class as any }));

const styles = tv({
    base: 'relative [&_tr:last-child]:border-0',
    variants: {
        framed: {
            true: 'in-data-[slot=frame]:rounded-md in-data-[slot=frame]:shadow-xs/5 before:pointer-events-none before:absolute before:inset-px not-in-data-[slot=frame]:before:hidden before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_var(--color-black)/4%] dark:before:shadow-[0_-1px_var(--color-white)/8%] in-data-[slot=frame]:*:[tr]:border-0 in-data-[slot=frame]:*:[tr]:*:[td]:border-b in-data-[slot=frame]:*:[tr]:*:[td]:bg-background in-data-[slot=frame]:*:[tr]:*:[td]:bg-clip-padding in-data-[slot=frame]:*:[tr]:first:*:[td]:first:rounded-ss-md in-data-[slot=frame]:*:[tr]:*:[td]:first:border-s in-data-[slot=frame]:*:[tr]:first:*:[td]:border-t in-data-[slot=frame]:*:[tr]:last:*:[td]:last:rounded-ee-md in-data-[slot=frame]:*:[tr]:*:[td]:last:border-e in-data-[slot=frame]:*:[tr]:first:*:[td]:last:rounded-se-md in-data-[slot=frame]:*:[tr]:last:*:[td]:first:rounded-es-md in-data-[slot=frame]:*:[tr]:hover:*:[td]:bg-transparent in-data-[slot=frame]:*:[tr]:data-[state=selected]:*:[td]:bg-muted/72',
            false: '*:[tr]:*:[td]:border-b *:[tr:hover]:*:[td]:bg-muted/72 *:[tr[data-state=selected]]:*:[td]:bg-muted/72 *:[tr:last-child]:*:[td]:border-b-0',
        },
    },
});
</script>

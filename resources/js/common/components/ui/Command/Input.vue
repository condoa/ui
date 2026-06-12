<template>
    <div data-slot="command-input-wrapper" class="flex h-9 items-center gap-2 border-b px-3" cmdk-input-wrapper>
        <Icon name="icon-search" class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <ListboxFilter v-bind="{ ...forwardedProps, ...$attrs }" v-model="filterState.search" data-slot="command-input" :auto-focus="props.autoFocus" cmdk-input :class="styles({ class: props.class })" />
    </div>
</template>

<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import Icon from '@/common/components/Icon.vue'
import { ListboxFilter, useForwardProps } from 'reka-ui'
import type { ListboxFilterProps } from 'reka-ui'
import { useCommand } from './useCommand'

defineOptions({ inheritAttrs: false })

interface Props extends ListboxFilterProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
    /** Whether to auto-focus the input on mount. Defaults to true. */
    autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    autoFocus: true,
})

const styles = tv({
    base: 'flex h-10 w-full rounded-md bg-transparent py-3 text-sm border-0 outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
})

const forwardedProps = useForwardProps(reactiveOmit(props, 'class', 'autoFocus'))

const { filterState } = useCommand()
</script>

<template>
    <ListboxGroup v-bind="forwarded" :id="id" :class="styles({ class: props.class })" data-slot="command-group" :hidden="isRender ? undefined : true" cmdk-group>
        <ListboxGroupLabel v-if="heading" cmdk-group-heading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            {{ heading }}
        </ListboxGroupLabel>
        <slot />
    </ListboxGroup>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { ListboxGroup, ListboxGroupLabel, useId } from 'reka-ui'
import type { ListboxGroupProps } from 'reka-ui'
import { provideCommandGroupContext, useCommand } from './useCommand'

interface Props extends ListboxGroupProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
    heading?: string
}

const props = defineProps<Props>()

const styles = tv({
    base: 'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
})

const forwarded = reactiveOmit(props, 'class')

const { allGroups, filterState } = useCommand()

const id = useId()

const isRender = computed(() => (!filterState.search ? true : filterState.filtered.groups.has(id)))

provideCommandGroupContext({ id })

onMounted(() => {
    if (!allGroups.value.has(id)) allGroups.value.set(id, new Set())
})

onUnmounted(() => {
    allGroups.value.delete(id)
})
</script>

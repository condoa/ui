<template>
    <Primitive v-if="isRender" v-bind="forwarded" :class="styles({ class: props.class })" data-slot="command-empty" cmdk-empty>
        <slot />
    </Primitive>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { useCommand } from './useCommand'

const props = defineProps<PrimitiveProps & { class?: ClassValue }>()

const forwarded = reactiveOmit(props, 'class')

const { filterState } = useCommand()

const isRender = computed(() => !!filterState.search && filterState.filtered.count === 0)

const styles = tv({
    base: 'py-6 text-center text-sm',
})
</script>

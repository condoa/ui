<template>
    <Separator orientation="vertical" v-bind="forwarded" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { type ClassValue, tv } from 'tailwind-variants'
import Separator from '../Separator.vue'

interface Props {
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'h-5',
})
</script>

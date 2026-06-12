<template>
    <UiInput :class="props.class" unstyled v-bind="$attrs" />
</template>

<script lang="ts" setup>
import UiInput from '../Input.vue'
import type { ClassValue } from 'tailwind-variants'

defineOptions({ inheritAttrs: false })

interface Props {
    /** Additional classes to add to the input */
    class?: ClassValue
}

const props = defineProps<Props>()
</script>

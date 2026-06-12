<template>
    <DialogRoot data-slot="dialog" v-bind="forwarded" v-model:open="isOpen">
        <slot />
    </DialogRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DialogRoot, useForwardPropsEmits } from 'reka-ui'
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'
import { useDialogNesting } from './useDialogNesting'

const props = defineProps<DialogRootProps>()

const emit = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'open'), emit)

const isOpen = defineModel<boolean>('open', { default: false })

useDialogNesting(isOpen)
</script>

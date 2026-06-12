<template>
    <EditableRoot :ref="forwardRef" v-slot="slotProps" v-bind="forwarded">
        <slot v-bind="slotProps" />
    </EditableRoot>
</template>

<script lang="ts" setup>
import { EditableRoot, useForwardExpose, useForwardPropsEmits } from 'reka-ui'
import type { EditableRootEmits, EditableRootProps } from 'reka-ui'
import { onMounted } from 'vue'

const { currentRef, forwardRef } = useForwardExpose()

const props = defineProps<EditableRootProps>()

interface Emits extends EditableRootEmits {
    ready: [v?: any]
}

const emit = defineEmits<Emits>()

const forwarded = useForwardPropsEmits(props, emit)

onMounted(() => {
    // Emit the ready event with the current ref value
    emit('ready', currentRef)
})
</script>

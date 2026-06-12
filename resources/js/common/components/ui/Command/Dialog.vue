<template>
    <Dialog v-bind="forwarded">
        <DialogContent :show-close-button="showCloseButton" class="overflow-hidden p-0 shadow-lg">
        <DialogHeader class="sr-only">
            <DialogTitle :title />
            <DialogDescription :description />
        </DialogHeader>
        <Command class="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-4 [&_[cmdk-input-wrapper]_svg]:w-4 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <slot />
        </Command>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>
import { useForwardPropsEmits } from 'reka-ui'
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'
import Dialog from '../Dialog/Dialog.vue'

interface Props extends DialogRootProps {
    /**
     * The title of the command dialog.
     *
     * @default "Command Palette"
     */
    title?: string
    /**
     * The description of the command dialog.
     *
     * @default "Search for a command to run...".
     */
    description?: string
    /**
     * Whether to show the close button in the dialog header.
     *
     * @default true
     */
    showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Command Palette',
    description: 'Search for a command to run...',
})

const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

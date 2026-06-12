<template>
    <div ref="dropZoneRef" data-slot="dropfile" role="button" tabindex="0" :aria-label="title || 'Upload files'" :class="styles({ isOverDropZone, class: props.class })" @click="open()" @keydown.enter.prevent="open()" @keydown.space.prevent="open()">
        <slot>
            <slot name="message">
                <div data-slot="dropfile-message" class="py-10 text-center">
                    <slot name="icon">
                        <div v-if="icon" data-slot="dropfile-icon-wrapper" class="inline-flex items-center justify-center rounded-md border p-2 transition" :class="[isOverDropZone && 'animate-bounce border-primary']">
                            <Icon data-slot="dropfile-icon" :name="icon" class="h-7 w-7 text-muted-foreground" :class="[isOverDropZone && 'text-primary']" />
                        </div>
                    </slot>
                    <slot name="title">
                        <p v-if="title" data-slot="dropfile-title" class="mt-5 text-sm font-medium" v-html="title" />
                    </slot>
                    <slot name="subtext">
                        <p v-if="subtext" data-slot="dropfile-subtext" class="mt-1 text-sm text-muted-foreground/60" v-html="subtext" />
                    </slot>
                </div>
            </slot>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { useDropZone, useFileDialog } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { tv, type ClassValue } from 'tailwind-variants'
import Icon from '@/common/components/Icon.vue'

interface Props {
    /**
     * The text to display as the title of the dropzone.
     *
     * @security Rendered as raw HTML via `v-html`. Pass only trusted, static, or
     * pre-sanitized markup; for user-supplied text use the `title` slot.
     * @default "Click to upload or drag & drop files."
     */
    title?: string
    /**
     * The text to display as the subtext of the dropzone.
     *
     * @security Rendered as raw HTML via `v-html`. Pass only trusted, static, or
     * pre-sanitized markup; for user-supplied text use the `subtext` slot.
     * @default "All file types accepted"
     */
    subtext?: string
    /**
     * The icon to display in the dropzone.
     *
     * @default "icon-cloud-upload"
     */
    icon?: string
    /**
     * The function to call when files are dropped.
     */
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    onDrop?: Function
    /**
     * Whether or not to allow multiple files to be picked. Does not affect drag and drop.
     *
     * @default true
     */
    multiple?: boolean
    /**
     * The file types to accept. Does not affect drag and drop.
     *
     * @default "*"
     */
    accept?: string
    /**
     * Any additional class that should be added to the dropzone.
     */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Click to upload or drag & drop files.',
    subtext: 'All file types accepted',
    icon: 'icon-cloud-upload',
    multiple: true,
    accept: '*',
})

const { open, reset, onChange } = useFileDialog({
    multiple: props.multiple,
    accept: props.accept,
})

onChange((files: FileList | null) => {
    if (files?.length) {
        handleDrop(Array.from(files || []))
        reset()
    }
})

const dropZoneRef = useTemplateRef('dropZoneRef')

const emits = defineEmits<{
    dropped: [any]
}>()

const handleDrop = (files: File[] | null) => {
    if (!files) {
        return
    }

    if (props.onDrop) {
        props.onDrop(files)
    }

    emits('dropped', files)
}

const { isOverDropZone } = useDropZone(dropZoneRef, handleDrop)

const styles = tv({
    base: 'flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed transition hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
    variants: {
        isOverDropZone: { true: 'border-primary bg-primary/10' },
    },
})

defineExpose({ dropZoneRef })
</script>

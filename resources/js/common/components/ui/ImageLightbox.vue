<script setup lang="ts">
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
    images: Array<{ url: string; name?: string }>
    startIndex?: number
}>()

const emit = defineEmits<{
    close: []
}>()

const containerRef = ref<HTMLElement | null>(null)
let viewer: Viewer | null = null

const initViewer = () => {
    if (!containerRef.value || !props.images.length) {
        return
    }

    viewer?.destroy()

    viewer = new Viewer(containerRef.value, {
        inline: false,
        button: true,
        navbar: props.images.length > 1,
        title: (image: HTMLImageElement) => image.alt || '',
        toolbar: {
            zoomIn: true,
            zoomOut: true,
            oneToOne: true,
            reset: true,
            prev: props.images.length > 1,
            next: props.images.length > 1,
            rotateLeft: true,
            rotateRight: true,
            flipHorizontal: true,
            flipVertical: true,
        },
        transition: false,
        hidden: () => emit('close'),
        initialViewIndex: props.startIndex ?? 0,
    })

    viewer.show()
}

onMounted(() => initViewer())

watch(() => [props.images, props.startIndex], () => initViewer(), { deep: true })

onBeforeUnmount(() => {
    viewer?.destroy()
    viewer = null
})
</script>

<template>
    <div ref="containerRef" class="hidden">
        <img
            v-for="(image, index) in images"
            :key="index"
            :src="image.url"
            :alt="image.name || ''"
        />
    </div>
</template>

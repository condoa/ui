<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/common/components/Icon.vue'
import type { ClassValue } from 'tailwind-variants'

type PdfViewerProps = {
    src: string
    downloadUrl?: string
    class?: ClassValue
}

const props = defineProps<PdfViewerProps>()

const loading = ref(true)

const onLoad = () => {
    loading.value = false
}
</script>

<template>
    <div :class="['relative flex flex-col overflow-hidden rounded-lg border bg-background', props.class]">
        <!-- Toolbar -->
        <div class="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
            <div class="flex items-center gap-2">
                <slot name="title">
                    <Icon name="icon-file-text" class="size-4 text-muted-foreground" />
                    <span class="text-sm font-medium text-muted-foreground">PDF</span>
                </slot>
            </div>
            <div class="flex items-center gap-1.5">
                <a :href="downloadUrl ?? src + (src.includes('?') ? '&' : '?') + 'download=1'" download>
                    <Button size="sm" variant="outline">
                        <Icon name="icon-download" class="size-3.5" />
                        {{ __('form.download') }}
                    </Button>
                </a>
                <a :href="src" target="_blank">
                    <Button size="sm" variant="ghost">
                        <Icon name="icon-external-link" class="size-3.5" />
                    </Button>
                </a>
                <slot name="actions" />
            </div>
        </div>

        <!-- PDF iframe -->
        <div class="relative flex-1">
            <!-- Loading skeleton -->
            <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-muted/20">
                <Icon name="icon-loading" class="size-8 text-muted-foreground" />
            </div>

            <iframe
                :src="src"
                title="PDF document"
                class="size-full"
                frameborder="0"
                @load="onLoad"
            />
        </div>
    </div>
</template>

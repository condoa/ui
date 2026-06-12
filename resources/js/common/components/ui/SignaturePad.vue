<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
    width?: number
    height?: number
    penColor?: string
    disabled?: boolean
}>(), {
    width: 400,
    height: 200,
    penColor: '#000000',
    disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string | null]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const hasDrawn = ref(false)

let ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
    if (!canvasRef.value) return
    ctx = canvasRef.value.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = props.penColor
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
})

function getPosition(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = canvasRef.value!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
        const touch = e.touches[0]
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY,
        }
    }
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
    }
}

function startDrawing(e: MouseEvent | TouchEvent) {
    if (props.disabled || !ctx) return
    e.preventDefault()
    isDrawing.value = true
    const pos = getPosition(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
}

function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing.value || !ctx) return
    e.preventDefault()
    const pos = getPosition(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    hasDrawn.value = true
}

function stopDrawing() {
    if (!isDrawing.value) return
    isDrawing.value = false
    if (hasDrawn.value) {
        emit('update:modelValue', canvasRef.value?.toDataURL('image/png') ?? null)
    }
}

function clear() {
    if (!ctx || !canvasRef.value) return
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    hasDrawn.value = false
    emit('update:modelValue', null)
}

function isEmpty(): boolean {
    return !hasDrawn.value
}

function toDataURL(): string | null {
    if (!hasDrawn.value || !canvasRef.value) return null
    return canvasRef.value.toDataURL('image/png')
}

defineExpose({ clear, isEmpty, toDataURL })
</script>

<template>
    <div class="space-y-2">
        <div class="relative rounded-lg border border-border bg-background overflow-hidden" :class="{ 'opacity-50': disabled }">
            <canvas
                ref="canvasRef"
                :width="width"
                :height="height"
                class="w-full touch-none cursor-crosshair"
                aria-label="Signature canvas"
                :aria-disabled="disabled || undefined"
                :style="{ height: `${height / 2}px` }"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart="startDrawing"
                @touchmove="draw"
                @touchend="stopDrawing"
            />
            <div v-if="!hasDrawn" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span class="text-sm text-muted-foreground/40">Assine aqui</span>
            </div>
        </div>
        <div class="flex justify-end">
            <Button v-if="hasDrawn" type="button" variant="ghost" size="sm" @click="clear">
                {{ __('form.clear') }}
            </Button>
        </div>
    </div>
</template>

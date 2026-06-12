<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        plate: string
        vehicleType?: string
        size?: 'sm' | 'md'
    }>(),
    {
        vehicleType: 'car',
        size: 'md',
    },
)

const normalized = computed(() => {
    return props.plate?.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || ''
})

const isMercosul = computed(() => /^[A-Z]{3}\d[A-Z]\d{2}$/.test(normalized.value))
const isOld = computed(() => /^[A-Z]{3}\d{4}$/.test(normalized.value))
const isMotorcycle = computed(() => props.vehicleType === 'motorcycle')

const topLine = computed(() => normalized.value.slice(0, 3))
const bottomLine = computed(() => normalized.value.slice(3))

const formatted = computed(() => {
    if (isOld.value) {
        return topLine.value + '-' + bottomLine.value
    }
    return normalized.value
})
</script>

<template>
    <div class="inline-flex select-none" role="img" :aria-label="normalized">
        <!-- ── Old format ────────────────────────────────────── -->
        <template v-if="isOld">
            <!-- Motorcycle: two rows -->
            <div v-if="isMotorcycle"
                class="flex flex-col items-center justify-center rounded-md bg-[#c5c5c5] shadow-[0_1px_3px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.25)] font-plate-old text-[#2a2a2a]"
                :class="size === 'sm' ? 'px-2.5 py-1.5 text-[16px] gap-px' : 'px-3 py-2 text-[22px] gap-0.5'">
                <span class="leading-none tracking-[0.12em] translate-y-[2px]">{{ topLine }}</span>
                <span class="leading-none tracking-[0.10em] translate-y-[2px]">{{ bottomLine }}</span>
            </div>
            <!-- Car: single row -->
            <div v-else
                class="flex items-center justify-center rounded-md bg-[#c5c5c5] shadow-[0_1px_3px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.25)] font-plate-old text-[#2a2a2a]"
                :class="size === 'sm' ? 'px-3 py-1.5 text-[16px]' : 'px-4 py-2 text-[22px]'">
                <span class="leading-none tracking-[0.12em] translate-y-[2px]">{{ formatted }}</span>
            </div>
        </template>

        <!-- ── Mercosul (new format) ─────────────────────────── -->
        <template v-else-if="isMercosul">
            <!-- Motorcycle: two rows -->
            <div v-if="isMotorcycle"
                class="flex flex-col rounded-md overflow-hidden w-[80px] text-[27px] bg-white border border-black shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div class="bg-[#003399] text-center h-[10px] flex items-center justify-center">
                    <span class="text-white font-bold leading-none text-[9px]">BRASIL</span>
                </div>
                <div class="flex-1 flex flex-col items-center justify-center font-plate-new text-[#1a1a1a] -translate-y-[3px] translate-x-[1px]">
                    <span class="leading-none tracking-[0.12em]">{{ topLine }}</span>
                    <span class="leading-none tracking-[0.10em] -mt-2">{{ bottomLine }}</span>
                </div>
            </div>
            <!-- Car: single row -->
            <div v-else
                class="flex flex-col rounded-md overflow-hidden w-[130px] text-[27px] bg-white border border-black shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                <div class="bg-[#003399] text-center h-[10px] flex items-center justify-center">
                    <span class="text-white font-bold leading-none text-[9px]">BRASIL</span>
                </div>
                <div class="flex-1 flex items-center justify-center font-plate-new text-[#1a1a1a] -translate-y-[3px] translate-x-[1px]">
                    <span class="leading-none tracking-[0.10em]">{{ formatted }}</span>
                </div>
            </div>
        </template>

        <!-- ── Fallback ──────────────────────────────────────── -->
        <span v-else-if="normalized" :class="['font-mono text-muted-foreground',
            size === 'sm' ? 'text-xs' : 'text-sm']">{{ normalized }}</span>
    </div>
</template>

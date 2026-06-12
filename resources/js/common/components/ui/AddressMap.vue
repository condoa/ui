<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
    latitude: number | null
    longitude: number | null
    interactive?: boolean
}>()

const emit = defineEmits<{
    'update:latitude': [value: number]
    'update:longitude': [value: number]
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

const hasCoords = computed(() => props.latitude != null && props.longitude != null)

const pinIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-primary drop-shadow-md"><path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 3.397 2.828l.431.296.003.002zM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd" /></svg>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
})

const initMap = () => {
    if (!mapContainer.value || !hasCoords.value) return

    if (map) {
        map.remove()
        map = null
        marker = null
    }

    const interactive = props.interactive ?? false

    map = L.map(mapContainer.value, {
        zoomControl: interactive,
        attributionControl: false,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: false,
        touchZoom: interactive,
    }).setView([props.latitude!, props.longitude!], 16)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map)

    marker = L.marker([props.latitude!, props.longitude!], {
        icon: pinIcon,
        draggable: interactive,
    }).addTo(map)

    if (interactive) {
        marker.on('dragend', () => {
            const pos = marker!.getLatLng()
            emit('update:latitude', pos.lat)
            emit('update:longitude', pos.lng)
        })
    }
}

// Only react to external prop changes (skip if interactive drag caused the change)
let skipNextWatch = false

watch([() => props.latitude, () => props.longitude], () => {
    if (skipNextWatch) {
        skipNextWatch = false
        return
    }

    if (hasCoords.value) {
        if (map && marker) {
            map.setView([props.latitude!, props.longitude!], 16)
            marker.setLatLng([props.latitude!, props.longitude!])
        } else {
            nextTick(initMap)
        }
    }
})

onMounted(() => {
    if (hasCoords.value) {
        initMap()
    }
})

onUnmounted(() => {
    if (map) {
        map.remove()
        map = null
        marker = null
    }
})
</script>

<template>
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[260px]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-[260px]"
        leave-to-class="opacity-0 max-h-0"
    >
        <div v-if="hasCoords" class="overflow-hidden space-y-1.5">
            <div ref="mapContainer" class="h-[240px] w-full rounded-lg border border-border-primary" :class="{ 'cursor-grab active:cursor-grabbing': interactive }" :aria-label="interactive ? 'Draggable address map' : 'Address map'" />
            <p v-if="interactive" class="text-xs text-muted-foreground">
                {{ __('address_map.hint') }}
            </p>
        </div>
    </Transition>
</template>

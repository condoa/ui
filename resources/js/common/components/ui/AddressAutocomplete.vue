<script setup lang="ts">
import Icon from '@/common/components/Icon.vue'
import { usePage } from '@inertiajs/vue3'
import { computed, ref, watch } from 'vue'

// Minimal Google Maps Places/Geocoding surface used by this component. Keeping
// it local removes the dependency on an ambient `google.maps` global, so the
// component is self-contained. Replace with `@types/google.maps` if the full
// SDK type surface is needed.
interface GooglePlace {
    fetchFields(options: { fields: string[] }): Promise<{ place: GooglePlace }>
    addressComponents?: Array<{ longText: string; shortText: string; types: string[] }>
    location?: { lat(): number; lng(): number }
    formattedAddress?: string
}

interface GooglePlacePrediction {
    placeId: string
    text: { toString(): string }
    toPlace(): GooglePlace
}

interface GoogleAutocompleteSuggestion {
    placePrediction: GooglePlacePrediction | null
}

interface GoogleGeocoder {
    geocode(request: { address?: string; region?: string }): Promise<{
        results: Array<{ geometry: { location: { lat(): number; lng(): number } } }>
    }>
}

interface GoogleMapsApi {
    importLibrary(name: 'geocoding'): Promise<{ Geocoder: new () => GoogleGeocoder }>
    importLibrary(name: string): Promise<unknown>
    places: {
        AutocompleteSessionToken: new () => object
        AutocompleteSuggestion: {
            fetchAutocompleteSuggestions(request: {
                input: string
                sessionToken: object
                includedRegionCodes?: string[]
            }): Promise<{ suggestions: GoogleAutocompleteSuggestion[] }>
        }
    }
}

interface AddressResult {
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
    latitude: number | null
    longitude: number | null
}

interface Suggestion {
    placeId: string
    description: string
    placePrediction: GooglePlacePrediction
}

const emit = defineEmits<{
    select: [result: AddressResult]
    geocode: [coords: { latitude: number; longitude: number }]
    error: [payload: { title: string; description: string }]
}>()

const props = defineProps<{
    placeholder?: string
    initialQuery?: string
}>()

const page = usePage()
const apiKey = computed(() => page.props.google_maps_api_key as string)

const gmaps = (): GoogleMapsApi => (window as unknown as { google: { maps: GoogleMapsApi } }).google.maps

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref(props.initialQuery ?? '')
const predictions = ref<Suggestion[]>([])
const isOpen = ref(false)
const isLoading = ref(false)
const selectedIndex = ref(-1)
let sessionToken: object | null = null
let sdkLoaded = false

const loadGoogleMaps = (): Promise<void> => {
    if (sdkLoaded) {
        return Promise.resolve()
    }

    const win = window as unknown as { google?: { maps?: unknown } }

    if (!win.google?.maps) {
        const bootstrap = (g: Record<string, string>) => {
            const c = 'google'
            const l = 'importLibrary'
            const q = '__ib__'
            const m = document
            const b = window as any
            b[c] = b[c] || {}
            const d = b[c].maps = b[c].maps || {}
            const r = new Set<string>()
            const e = new URLSearchParams()
            let h: Promise<void> | null = null

            const u = () =>
                h ||
                (h = new Promise<void>((f, n) => {
                    const a = m.createElement('script')
                    e.set('libraries', [...r] + '')
                    for (const k in g) {
                        e.set(k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()), g[k])
                    }
                    e.set('callback', c + '.maps.' + q)
                    a.src = `https://maps.${c}apis.com/maps/api/js?` + e
                    ;(d as any)[q] = f
                    a.onerror = () => (h = null, n(new Error('Google Maps could not load.')))
                    a.nonce = (m.querySelector('script[nonce]') as HTMLScriptElement | null)?.nonce || ''
                    m.head.append(a)
                }))

            if (!d[l]) {
                d[l] = (f: string, ...n: any[]) => {
                    r.add(f)
                    return u().then(() => d[l](f, ...n))
                }
            }
        }

        bootstrap({ key: apiKey.value, v: 'weekly', language: 'pt-BR' })
    }

    return gmaps().importLibrary('places').then(() => {
        sdkLoaded = true
    })
}

const ensureSession = () => {
    if (!sessionToken) {
        sessionToken = new (gmaps().places.AutocompleteSessionToken)()
    }
}

let debounceTimer: ReturnType<typeof setTimeout>

const onInput = () => {
    clearTimeout(debounceTimer)
    selectedIndex.value = -1

    if (query.value.length < 3) {
        predictions.value = []
        isOpen.value = false
        return
    }

    isLoading.value = true

    debounceTimer = setTimeout(async () => {
        await searchQuery(query.value)
        isLoading.value = false
    }, 800)
}

const selectPrediction = async (suggestion: Suggestion) => {
    isOpen.value = false
    query.value = suggestion.description
    isLoading.value = true

    try {
        const place = suggestion.placePrediction.toPlace()
        await place.fetchFields({ fields: ['addressComponents', 'location'] })

        // Reset session after a selection (new session for next search)
        sessionToken = null

        const components = place.addressComponents ?? []
        const get = (type: string) => components.find((c) => c.types.includes(type))?.longText ?? ''
        const getShort = (type: string) => components.find((c) => c.types.includes(type))?.shortText ?? ''

        const result: AddressResult = {
            street: get('route'),
            number: get('street_number'),
            complement: '',
            neighborhood: get('sublocality_level_1') || get('sublocality'),
            city: get('administrative_area_level_2'),
            state: getShort('administrative_area_level_1'),
            zip_code: get('postal_code').replace(/\D/g, ''),
            latitude: place.location?.lat() ?? null,
            longitude: place.location?.lng() ?? null,
        }

        emit('select', result)
    } catch (error) {
        reportError(error, 'fetchFields')
    }

    isLoading.value = false
}

const reportError = (error: unknown, context: string) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[AddressAutocomplete] ${context}:`, error)

    emit('error', {
        title: __('address_map.search_failed_title'),
        description: message || __('address_map.search_failed_description'),
    })
}

const searchQuery = async (text: string) => {
    try {
        await loadGoogleMaps()
    } catch (error) {
        reportError(error, 'loadGoogleMaps')
        predictions.value = []
        isOpen.value = false
        return
    }

    ensureSession()

    try {
        const { suggestions } = await gmaps().places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: text,
            sessionToken: sessionToken!,
            includedRegionCodes: ['br'],
        })

        predictions.value = suggestions
            .filter((s) => s.placePrediction)
            .map((s) => ({
                placeId: s.placePrediction!.placeId,
                description: s.placePrediction!.text.toString(),
                placePrediction: s.placePrediction!,
            }))

        isOpen.value = predictions.value.length > 0
    } catch (error) {
        reportError(error, 'fetchAutocompleteSuggestions')
        predictions.value = []
        isOpen.value = false
    }
}

const geocodeAddress = async (address: string) => {
    await loadGoogleMaps()
    const { Geocoder } = await gmaps().importLibrary('geocoding')

    try {
        const geocoder = new Geocoder()
        const { results } = await geocoder.geocode({ address, region: 'br' })

        if (results.length > 0) {
            const location = results[0].geometry.location
            emit('geocode', {
                latitude: location.lat(),
                longitude: location.lng(),
            })
        }
    } catch {
        // geocoding failed silently
    }
}

watch(() => props.initialQuery, (val) => {
    if (val) {
        query.value = val
        geocodeAddress(val)
    }
}, { immediate: true })

const onKeydown = (e: KeyboardEvent) => {
    if (!isOpen.value || predictions.value.length === 0) return

    if (e.key === 'ArrowDown') {
        e.preventDefault()
        selectedIndex.value = Math.min(selectedIndex.value + 1, predictions.value.length - 1)
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex.value >= 0) {
            selectPrediction(predictions.value[selectedIndex.value])
        }
    } else if (e.key === 'Escape') {
        isOpen.value = false
    }
}

const onBlur = () => {
    setTimeout(() => {
        isOpen.value = false
    }, 200)
}
</script>

<template>
    <div class="relative">
        <div class="relative">
            <InputControl>
                <Icon name="icon-search" class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <input
                    ref="inputRef"
                    v-model="query"
                    type="text"
                    role="combobox"
                    :aria-expanded="isOpen"
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    aria-controls="address-listbox"
                    :aria-activedescendant="selectedIndex >= 0 ? `address-option-${selectedIndex}` : undefined"
                    class="h-8.5 w-full min-w-0 border-0 bg-transparent rounded-[inherit] pl-9 pr-3 leading-8.5 outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground/72 md:h-7.5 md:leading-7.5"
                    :placeholder="placeholder ?? __('address_map.search_placeholder')"
                    autocomplete="off"
                    @input="onInput"
                    @keydown="onKeydown"
                    @blur="onBlur"
                />
                <Loader v-if="isLoading" class="absolute right-3 top-1/2 -translate-y-1/2 size-3.5" />
            </InputControl>
        </div>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
        >
            <div v-if="isOpen && predictions.length > 0" class="absolute z-50 mt-1 w-full rounded-md border border-border-primary bg-popover shadow-lg">
                <ul id="address-listbox" role="listbox" class="py-1">
                    <li
                        v-for="(prediction, i) in predictions"
                        :id="`address-option-${i}`"
                        :key="prediction.placeId"
                        role="option"
                        :aria-selected="i === selectedIndex"
                        class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors"
                        :class="i === selectedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'"
                        @mousedown.prevent="selectPrediction(prediction)"
                    >
                        <Icon name="icon-map-pin" class="size-3.5 text-muted-foreground shrink-0" />
                        <span class="truncate">{{ prediction.description }}</span>
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>

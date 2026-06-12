<template>
    <div
        data-slot="rating"
        :class="ratingClasses"
        :role="props.editable ? 'radiogroup' : undefined"
        :aria-label="props.editable ? props.label : undefined"
    >
        <div class="flex items-center">
            <div
                    v-for="(star, index) in props.maxRating"
                    :key="star"
                    :class="['relative', props.editable ? 'cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1' : '']"
                    :tabindex="props.editable ? rovingTabindex(star) : -1"
                    :role="props.editable ? 'radio' : undefined"
                    :aria-checked="props.editable ? (modelValue === star) : undefined"
                    :aria-label="props.editable ? `${star} star` : undefined"
                    @click="handleStarClick(star)"
                    @keydown.enter.space.prevent="handleStarClick(star)"
                    @keydown.left.up.prevent="props.editable && moveFocus(star, -1)"
                    @keydown.right.down.prevent="props.editable && moveFocus(star, 1)"
                    @mouseenter="handleStarMouseEnter(star)"
                    @mouseleave="handleStarMouseLeave"
                >
                <Icon v-if="props.icon" :name="props.icon" data-slot="rating-star-empty" :class="emptyStarClasses" aria-hidden="true" />
                <div class="absolute inset-0 overflow-hidden" :style="{ width: starWidths[index] }">
                    <Icon v-if="props.icon" :name="props.icon" data-slot="rating-star-filled" :class="filledStarClasses" aria-hidden="true" />
                </div>
            </div>
        </div>

        <template v-if="showValue">
            <span data-slot="rating-value" :class="valueClasses">
                {{ displayRating?.toFixed(1) }}
            </span>
        </template>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { tv, type ClassValue, type VariantProps } from 'tailwind-variants'
import { computed, nextTick, ref } from 'vue'

const ratingStyles = tv({
    slots: {
        rating: 'inline-flex items-center',
        star: '',
        value: 'w-5 tabular-nums text-muted-foreground',
    },
    variants: {
        size: {
            sm: { rating: 'gap-2', star: 'size-4', value: 'text-xs' },
            md: { rating: 'gap-2.5', star: 'size-5', value: 'text-sm' },
            lg: { rating: 'gap-3', star: 'size-6', value: 'text-base' },
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

type RatingProps = {
    /**
     * The maximum rating value.
     *
     * @default 5
     */
    maxRating?: number
    /**
     * Custom class(es) to add to the rating container.
     */
    class?: ClassValue
    /**
     * Custom class(es) to add to the value display.
     */
    valueClassName?: ClassValue
    /**
     * Custom class(es) to add to the empty star icons.
     */
    emptyIconClassName?: ClassValue
    /**
     * Custom class(es) to add to the filled star icons.
     */
    filledIconClassName?: ClassValue
    /**
     * The size variant of the rating component.
     *
     * @default "md"
     */
    size?: VariantProps<typeof ratingStyles>['size']
    /**
     * Whether to show the numeric rating value.
     *
     * @default false
     */
    showValue?: boolean
    /**
     * Whether the rating is editable by the user.
     *
     * @default false
     */
    editable?: boolean
    /**
     * Callback function when the rating changes.
     */
    onRatingChange?: (rating: number) => void
    /**
     * The icon to use for the rating stars.
     *
     * @default "lucide:star"
     */
    icon?: string
    /**
     * Accessible label for the radiogroup when editable.
     *
     * @default "Rating"
     */
    label?: string
}

const props = withDefaults(defineProps<RatingProps>(), {
    maxRating: 5,
    size: 'md',
    showValue: false,
    editable: false,
    icon: 'lucide:star',
    label: 'Rating',
})

const modelValue = defineModel<number>({ default: 0 })

if (modelValue.value < 0 || modelValue.value > props.maxRating) {
    console.warn(`Rating value ${modelValue.value} is out of bounds (0 - ${props.maxRating})`)
}

if (!props.icon) {
    console.warn(`No icon provided for Rating component, defaulting to 'icon-circle'`)
}

const emit = defineEmits<{
    ratingChange: [payload: number]
    starHover: [payload: number | null]
}>()

const hoveredRating = ref<number | null>(null)

const displayRating = computed(() =>
    props.editable && hoveredRating.value !== null ? hoveredRating.value : modelValue.value,
)

// Memoize style calculations to avoid recalculating on every render
const ratingClasses = computed(() => ratingStyles().rating({ class: props.class, size: props.size }))

const emptyStarClasses = computed(() =>
    ratingStyles().star({
        class: ['text-muted-foreground/30', props.emptyIconClassName],
        size: props.size,
    }),
)

const filledStarClasses = computed(() =>
    ratingStyles().star({
        class: ['fill-yellow-400 text-yellow-400', props.filledIconClassName],
        size: props.size,
    }),
)

const valueClasses = computed(() => ratingStyles().value({ class: props.valueClassName, size: props.size }))

const starWidths = computed(() => {
    const rating = displayRating.value
    return Array.from({ length: props.maxRating }, (_, i) => {
        const star = i + 1
        if (rating >= star) return '100%'
        if (rating > star - 1 && rating < star) return `${(rating - (star - 1)) * 100}%`
        return '0%'
    })
})

const handleStarClick = (starRating: number) => {
    if (props.editable) {
        props.onRatingChange?.(starRating)
        emit('ratingChange', starRating)
        modelValue.value = starRating
    }
}

const handleStarMouseEnter = (starRating: number) => {
    if (props.editable) {
        hoveredRating.value = starRating
        emit('starHover', starRating)
    }
}

const handleStarMouseLeave = () => {
    if (props.editable) {
        hoveredRating.value = null
        emit('starHover', null)
    }
}

/** Roving tabindex: only the selected star (or star 1 when none) receives tabindex="0". */
const rovingTabindex = (star: number): number => {
    const active = modelValue.value > 0 ? Math.round(modelValue.value) : 1
    return active === star ? 0 : -1
}

/** Move focus to the adjacent star and select it. */
const moveFocus = (currentStar: number, delta: number) => {
    const next = Math.min(Math.max(currentStar + delta, 1), props.maxRating)
    handleStarClick(next)
    nextTick(() => {
        const container = document.querySelector('[data-slot="rating"]')
        const stars = container?.querySelectorAll<HTMLElement>('[role="radio"]')
        stars?.[next - 1]?.focus()
    })
}

defineExpose({ displayRating, starWidths, modelValue })
</script>

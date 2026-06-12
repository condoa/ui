import type { PrimitiveProps } from 'reka-ui'
import type { ModelRef } from 'vue'
import type { ClassValue } from 'tailwind-variants'

export type TimelineData = {
    model: ModelRef<number | undefined, string, number | undefined, number | undefined>
    orientation: 'horizontal' | 'vertical'
}

export type TimelineProps = PrimitiveProps & {
    class?: ClassValue
    orientation?: 'horizontal' | 'vertical'
    modelValue?: number | undefined
}

export const timelineDataSymbol = Symbol('timeline-data')

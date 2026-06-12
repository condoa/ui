<template>
    <InputControl :class="props.class">
        <input
            :id
            ref="inputRef"
            type="text"
            inputmode="decimal"
            data-slot="input"
            :class="inputStyles()"
            v-bind="{ ...forwarded, ...$attrs }"
        />
    </InputControl>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { defu } from 'defu'
import { tv, type ClassValue } from 'tailwind-variants'
import { computed, useId } from 'vue'
import { useCurrencyInput } from 'vue-currency-input'
import type { CurrencyInputOptions } from 'vue-currency-input'
import InputControl from './InputControl.vue'

interface Props {
    /**
     * Custom class(es) to add to the input element
     */
    class?: ClassValue
    /**
     * The id of the input element
     */
    id?: string
    /**
     * The name of the input element
     */
    name?: string
    /**
     * The placeholder text for the input element
     */
    placeholder?: string
    /**
     * Whether the input is disabled
     */
    disabled?: boolean
    /**
     * Whether the input is required
     */
    required?: boolean
    modelValue?: any
    /**
     * Options for the currency input
     *
     * @see https://dm4t2.github.io/vue-currency-input/config.html
     */
    options?: CurrencyInputOptions
}

defineOptions({ inheritAttrs: false })

const props = defineProps<Props>()

const { inputRef, formattedValue, numberValue, setOptions, setValue } = useCurrencyInput(
    defu({}, props.options, {
        currency: 'BRL',
        locale: 'pt-BR',
        hideCurrencySymbolOnFocus: false,
        hideGroupingSeparatorOnFocus: false,
    }),
)

const forwarded = reactiveOmit(props, 'class', 'options', 'id', 'modelValue')

const id = computed(() => props.id || `currency-input-${useId()}`)

const inputStyles = tv({
    base: [
        'h-8.5 w-full min-w-0 border-0 bg-transparent rounded-[inherit] px-3 leading-8.5 tabular-nums outline-none ring-0 focus-visible:outline-none selection:bg-primary selection:text-primary-foreground',
        'placeholder:text-muted-foreground/72',
        'md:h-7.5 md:leading-7.5',
    ],
})

defineExpose({ inputRef, formattedValue, numberValue, setOptions, setValue })
</script>

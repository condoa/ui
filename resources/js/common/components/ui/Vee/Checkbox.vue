<template>
    <div>
        <div :class="styles().wrapper({ class: props.wrapperClass })">
            <input :id="inputId" :checked="checked" type="checkbox" :data-indeterminate="indeterminate" :data-checked="checked" :data-disabled="disabled" :data-required="required" :aria-invalid="!!errorMessage" :aria-describedby="errorMessage ? errorId : undefined" :class="styles().checkbox({ error: !!errorMessage, disabled, size, color, class: props.class })" v-bind="{ ...forwarded, ...$attrs }" @change="handleChange" @input="handleChange" />
            <label v-if="hasLabel || hasDescription || errorMessage" :for="inputId" class="flex flex-col gap-1 text-sm leading-[1.25]">
                <slot name="label">
                    <span v-if="label" :class="styles().label({ disabled, class: props.labelClass })" >
                        {{ label }}
                    </span>
                </slot>
                <slot name="description">
                    <span v-if="description" :class="styles().description({ disabled, class: props.descriptionClass })" >
                        {{ description }}
                    </span>
                </slot>
                <AnimatePresence>
                    <motion.p v-if="errorMessage" :id="errorId" role="alert" :variants initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="styles().error({ disabled })">
                        {{ errorMessage }}
                    </motion.p>
                </AnimatePresence>
            </label>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AnimatePresence, motion } from 'motion-v'
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue, type VariantProps } from 'tailwind-variants'
import { useField } from 'vee-validate'
import { computed, useId, useSlots } from 'vue'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

const styles = tv({
    slots: {
        checkbox:
            'peer form-checkbox size-4 shrink-0 cursor-pointer rounded-[3px] border border-transparent bg-background text-neutral-600 shadow-border shadow-xs transition duration-200 focus:ring-[2px] focus:ring-ring/50 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        label: 'cursor-pointer font-medium select-none',
        description: 'text-pretty text-muted-foreground',
        wrapper: 'flex items-start gap-2',
        error: 'text-destructive',
    },
    variants: {
        size: { sm: { checkbox: 'size-3.5' }, md: { checkbox: 'size-4' } },
        color: {
            red: { checkbox: 'border-red-500 text-red-500 focus:ring-red-500/50' },
            orange: { checkbox: 'border-orange-500 text-orange-500 focus:ring-orange-500/50' },
            amber: { checkbox: 'border-amber-500 text-amber-500 focus:ring-amber-500/50' },
            yellow: { checkbox: 'border-yellow-500 text-yellow-500 focus:ring-yellow-500/50' },
            lime: { checkbox: 'border-lime-500 text-lime-500 focus:ring-lime-500/50' },
            green: { checkbox: 'border-green-500 text-green-500 focus:ring-green-500/50' },
            emerald: { checkbox: 'border-emerald-500 text-emerald-500 focus:ring-emerald-500/50' },
            teal: { checkbox: 'border-teal-500 text-teal-500 focus:ring-teal-500/50' },
            cyan: { checkbox: 'border-cyan-500 text-cyan-500 focus:ring-cyan-500/50' },
            sky: { checkbox: 'border-sky-500 text-sky-500 focus:ring-sky-500/50' },
            blue: { checkbox: 'border-blue-500 text-blue-500 focus:ring-blue-500/50' },
            indigo: { checkbox: 'border-indigo-500 text-indigo-500 focus:ring-indigo-500/50' },
            violet: { checkbox: 'border-violet-500 text-violet-500 focus:ring-violet-500/50' },
            purple: { checkbox: 'border-purple-500 text-purple-500 focus:ring-purple-500/50' },
            fuchsia: { checkbox: 'border-fuchsia-500 text-fuchsia-500 focus:ring-fuchsia-500/50' },
            pink: { checkbox: 'border-pink-500 text-pink-500 focus:ring-pink-500/50' },
            rose: { checkbox: 'border-rose-500 text-rose-500 focus:ring-rose-500/50' },
            slate: { checkbox: 'border-slate-600 text-slate-600 focus:ring-slate-600/50' },
            gray: { checkbox: 'border-gray-600 text-gray-600 focus:ring-gray-600/50' },
            zinc: { checkbox: 'border-zinc-600 text-zinc-600 focus:ring-zinc-600/50' },
            neutral: { checkbox: 'border-neutral-600 text-neutral-600 focus:ring-neutral-600/50' },
            stone: { checkbox: 'border-stone-600 text-stone-600 focus:ring-stone-600/50' },
        },
        error: {
            true: { checkbox: 'border-destructive text-destructive focus:ring-destructive/30' },
        },
        disabled: {
            true: {
                checkbox: 'pointer-events-none opacity-50',
                label: 'cursor-not-allowed opacity-50',
                description: 'cursor-not-allowed opacity-50',
                error: 'cursor-not-allowed opacity-70',
            },
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

export type VeeCheckboxProps = {
    /** Custom class(es) to add to the element */
    class?: ClassValue
    /** Custom class(es) to add to the label element */
    labelClass?: ClassValue
    /** Custom class(es) to add to the description element */
    descriptionClass?: ClassValue
    /** Custom class(es) to add to the wrapper element */
    wrapperClass?: ClassValue
    /** The id of the checkbox input element */
    id?: string
    /** The v-model binding for the checkbox */
    modelValue?: any
    /** The name of the checkbox input element */
    name?: string
    /** The value of the checkbox input element */
    value?: any
    /** Whether the checkbox is disabled */
    disabled?: boolean
    /** Whether the checkbox is required */
    required?: boolean
    /** Whether the checkbox is indeterminate */
    indeterminate?: boolean
    /**
     * The color variant of the checkbox
     *
     * @default neutral
     */
    color?: VariantProps<typeof styles>['color']
    /**
     * The size variant of the checkbox
     *
     * @default md
     */
    size?: VariantProps<typeof styles>['size']
    /** The label for the checkbox */
    label?: string
    /** The description for the checkbox */
    description?: string
    /** The validation rules for the checkbox */
    rules?: any
    /** Whether to validate the checkbox on mount */
    validateOnMount?: boolean
    /** The value to use when the checkbox is unchecked */
    unCheckedValue?: any
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<VeeCheckboxProps>(), {})

const inputId = props.id || `checkbox-${useId()}`
const errorId = `${inputId}-error`

const forwarded = reactiveOmit(
    props,
    'class',
    'id',
    'modelValue',
    'label',
    'description',
    'color',
    'size',
    'labelClass',
    'descriptionClass',
    'wrapperClass',
    'rules',
    'validateOnMount',
    'unCheckedValue',
)

const slots = useSlots()

const hasLabel = computed(() => !!slots.label || !!props.label)

const hasDescription = computed(() => !!slots.description || !!props.description)

const { errorMessage, checked, handleChange } = useField(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue,
    syncVModel: true,
    label: props.label,
    validateOnMount: props.validateOnMount,
    type: 'checkbox',
    checkedValue: props.value || true,
    uncheckedValue: props.unCheckedValue || false,
})
</script>

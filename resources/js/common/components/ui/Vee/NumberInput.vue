<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :class="[disabled && 'text-muted-foreground', errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        </Label>
        <NumberInput
            :id="inputId"
            :model-value="value"
            :min="min"
            :max="max"
            :step="step"
            :disabled="disabled"
            v-bind="$attrs"
            :aria-invalid="!!errorMessage"
            :aria-describedby="errorMessage ? errorId : undefined"
            @update:model-value="onValueChange"
            @raw-input="onRawInput"
        />
        <AnimatePresence multiple as="div" mode="wait">
            <slot name="hint" :error-message="errorMessage" :value>
                <motion.p v-if="hint && !errorMessage" :variants initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="formHintVariants({ variant: 'hint' })">
                    {{ hint }}
                </motion.p>
            </slot>
            <slot name="errorMessage" :error-message="errorMessage" :value>
                <motion.p v-if="errorMessage" :id="errorId" role="alert" :variants initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="formHintVariants({ variant: 'error' })">
                    {{ errorMessage }}
                </motion.p>
            </slot>
        </AnimatePresence>
    </div>
</template>

<script lang="ts" setup>
import NumberInput from '../NumberInput.vue'
import { formHintVariants } from '../Form/variants'
import { AnimatePresence, motion } from 'motion-v'
import { useField } from 'vee-validate'
import { useId } from 'vue'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props {
    label?: string
    hint?: string
    disabled?: boolean
    modelValue?: number | null
    name?: string
    id?: string
    rules?: any
    validateOnMount?: boolean
    required?: boolean
    min?: number
    max?: number
    step?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: number | undefined]
}>()

defineOptions({
    inheritAttrs: false,
})

const inputId = props.id || useId()
const errorId = `${inputId}-error`

const { errorMessage, value, validate, setValue } = useField<number | null | undefined>(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
})

const onValueChange = (val: number | undefined) => {
    setValue(val)
    validate()
    emit('update:modelValue', val)
}

const onRawInput = (rawValue: string) => {
    const trimmed = rawValue.trim()
    if (trimmed === '') {
        setValue(undefined)
    } else {
        const parsed = parseInt(trimmed, 10)
        if (!isNaN(parsed)) {
            setValue(parsed)
            emit('update:modelValue', parsed)
        }
    }
    validate()
}
</script>

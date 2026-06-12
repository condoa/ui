<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :hint="labelHint" :class="[disabled && 'text-muted-foreground', errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        </Label>
        <DateField v-bind="{ ...$attrs, ...props }" v-model="value" class="font-mono" :aria-invalid="!!errorMessage" :aria-describedby="errorMessage ? errorId : undefined" />
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
import DateField from '../DateField.vue'
import { formHintVariants } from '../Form/variants'
import type { DateValue } from '@internationalized/date'
import { AnimatePresence, motion } from 'motion-v'
import type { DateFieldRootProps } from 'reka-ui'
import { useField } from 'vee-validate'
import { useId } from 'vue'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props extends DateFieldRootProps {
    label?: string
    labelHint?: string
    hint?: string
    name?: string
    rules?: any
    validateOnMount?: boolean
    separator?: string
    separatorIcon?: string
}

const props = defineProps<Props>()

const inputId = props.id || useId()
const errorId = `${inputId}-error`

const { errorMessage, value } = useField<DateValue | undefined>(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue ?? undefined,
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
})
</script>

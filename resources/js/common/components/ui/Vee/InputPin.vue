<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :class="[disabled && 'text-muted-foreground', errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        </Label>
        <div class="relative">
            <InputPin :id="inputId" v-bind="({ ...$attrs, ...forwarded } as any)" v-model="value" :aria-invalid="!!errorMessage" :aria-describedby="errorMessage ? errorId : undefined" @complete="emits('complete', $event)" />
        </div>
        <AnimatePresence as="div" multiple mode="wait">
            <motion.p v-if="hint && !errorMessage" :variants initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="formHintVariants({ variant: 'hint' })">
                {{ hint }}
            </motion.p>
            <motion.p v-if="errorMessage" :id="errorId" role="alert" :variants initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="formHintVariants({ variant: 'error' })">
                {{ errorMessage }}
            </motion.p>
        </AnimatePresence>
    </div>
</template>

<script lang="ts" setup>
import InputPin from '../InputPin/InputPin.vue'
import { formHintVariants } from '../Form/variants'
import { AnimatePresence, motion } from 'motion-v'
import { reactiveOmit } from '@vueuse/core'
import type { PinInputRootProps } from 'reka-ui'
import { useField } from 'vee-validate'
import { useId } from 'vue'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props extends Omit<PinInputRootProps, 'as' | 'asChild'> {
    label?: string
    hint?: string
    id?: string
    rules?: any
    validateOnMount?: boolean
    separator?: string
    inputCount?: number
}

const props = defineProps<Props>()

interface Emits {
    complete: [value: string[]]
    'update:modelValue': [value: string[]]
}

const emits = defineEmits<Emits>()

const forwarded = reactiveOmit(props, 'label', 'hint', 'id', 'rules', 'validateOnMount', 'modelValue')

const inputId = props.id || useId()
const errorId = `${inputId}-error`

const { errorMessage, value } = useField(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue || [],
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
})
</script>

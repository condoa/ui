<template>
    <div :class="styles({ class: props.class })">
        <slot name="label" :error-message="errorMessage" :value="value">
            <Label v-if="label" class="mb-5 leading-none" :class="[errorMessage && 'text-destructive']">
                <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
            </Label>
        </slot>
        <RadioGroup v-bind="({ ...forwarded, ...$attrs } as any)" v-model="value" :aria-invalid="!!errorMessage" :aria-describedby="errorMessage ? errorId : undefined">
            <slot />
        </RadioGroup>
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
import RadioGroup from '../RadioGroup/RadioGroup.vue'
import { formHintVariants } from '../Form/variants'
import { AnimatePresence, motion } from 'motion-v'
import { useForwardProps } from 'reka-ui'
import type { RadioGroupRootProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'
import { useField } from 'vee-validate'
import { useId } from 'vue'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props extends RadioGroupRootProps {
    label?: string
    hint?: string
    id?: string
    rules?: any
    validateOnMount?: boolean
    class?: ClassValue
    name: string
}

const props = defineProps<Props>()

const forwarded = useForwardProps(props)

defineOptions({ inheritAttrs: false })

const styles = tv({
    base: 'flex flex-col',
})

const errorId = `${props.id || props.name || useId()}-error`

const { errorMessage, value } = useField(() => props.name, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnMount: props.validateOnMount,
    type: 'radio',
    syncVModel: true,
})
</script>

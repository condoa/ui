<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :hint="labelHint" :class="[disabled && 'text-muted-foreground', errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
            <slot name="labelHint"></slot>
        </Label>
        <div class="relative">
            <slot name="icon">
                <span v-if="hasIcon" class="absolute inset-y-0 left-3 flex items-center justify-center">
                    <Icon v-if="icon" :name="icon" class="size-4 text-muted-foreground"></Icon>
                </span>
            </slot>
            <slot name="trailingIcon">
                <span v-if="hasTrailingIcon" class="absolute inset-y-0 right-3 flex items-center justify-center">
                    <Icon v-if="trailingIcon" :name="trailingIcon" class="size-4 text-muted-foreground"></Icon>
                </span>
            </slot>
            <Input :id="inputId" v-model="value" :type="type" :required="required" :name="name" :disabled="disabled" v-bind="$attrs" :input-class="[hasIcon && 'pl-9', hasTrailingIcon && 'pr-9']" :placeholder="placeholder" @blur="handleBlur" :aria-invalid="!!errorMessage" :aria-describedby="errorMessage ? errorId : undefined" />
        </div>
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
import Icon from '@/common/components/Icon.vue'
import Input from '../Input.vue'
import { formHintVariants } from '../Form/variants'
import { AnimatePresence, motion } from 'motion-v'
import { useField } from 'vee-validate'
import { computed, useId, useSlots } from 'vue'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props {
    label?: string
    labelHint?: string
    icon?: string
    trailingIcon?: string
    hint?: string
    disabled?: boolean
    modelValue?: string | number
    name?: string
    id?: string
    rules?: any
    validateOnMount?: boolean
    type?: string
    placeholder?: string
    required?: boolean
}

const props = defineProps<Props>()

defineOptions({
    inheritAttrs: false,
})

const inputId = props.id || useId()
const errorId = `${inputId}-error`

const hasIcon = computed(() => Boolean(props.icon) || Boolean(useSlots().icon))

const hasTrailingIcon = computed(() => Boolean(props.trailingIcon) || Boolean(useSlots().trailingIcon))

const { errorMessage, value, handleBlur } = useField(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
})
</script>

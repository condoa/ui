<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :class="[errorMessage && 'text-destructive', 'mb-2']">
            {{ label }}
        </Label>
        <div class="relative">
            <slot name="icon">
                <span v-if="hasIcon" class="absolute">
                    <Icon v-if="icon" :name="icon" class="size-4 text-muted-foreground" />
                </span>
            </slot>
            <Select v-model="value" :disabled="disabled" :required="required" :name="name" v-bind="$attrs">
                <slot>
                    <slot name="trigger">
                        <SelectTrigger :id="inputId" :placeholder="placeholder" :aria-invalid="errorMessage ? true : undefined" :aria-describedby="errorMessage ? errorId : undefined" />
                    </slot>
                    <slot name="content" />
                </slot>
            </Select>
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
import { AnimatePresence, motion } from 'motion-v'
import { useField } from 'vee-validate'
import { computed, useId, useSlots } from 'vue'
import { formHintVariants } from './Form/variants'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props {
    /**
     * The label to display above the select.
     */
    label?: string
    /**
     * The icon to display inside the select.
     */
    icon?: string
    /**
     * The hint text to display below the select.
     */
    hint?: string
    /**
     * The current value of the select.
     */
    modelValue?: string
    /**
     * The name of the select for form submission.
     */
    name?: string
    /**
     * The id of the select element.
     */
    id?: string
    /**
     * Validation rules for VeeValidate.
     */
    rules?: any
    /**
     * Whether to validate on mount.
     */
    validateOnMount?: boolean
    /**
     * The placeholder text for the select.
     */
    placeholder?: string
    /**
     * Whether the select is disabled.
     */
    disabled?: boolean
    /**
     * Whether the select is required.
     */
    required?: boolean
}

const props = defineProps<Props>()

defineOptions({ inheritAttrs: false })

const inputId = computed(() => props.id || useId())
const errorId = computed(() => `${inputId.value}-error`)

const hasIcon = computed(() => Boolean(props.icon) || Boolean(useSlots().icon))

const { errorMessage, value } = useField(() => props.name || inputId.value, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
})
</script>

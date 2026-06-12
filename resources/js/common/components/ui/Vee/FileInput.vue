<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :class="[errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        </Label>
        <div class="relative">
            <slot name="icon">
                <span v-if="hasIcon" class="absolute inset-y-0 left-3 flex items-center justify-center">
                    <Icon v-if="icon" :name="icon" class="size-4 text-muted-foreground"></Icon>
                </span>
            </slot>
            <Input
                :id="inputId"
                type="file"
                :required="required"
                :name="name"
                v-bind="$attrs"
                :multiple="multiple"
                :input-class="[hasIcon && 'pl-9']"
                :accept="accept"
                :aria-invalid="!!errorMessage"
                :aria-describedby="errorMessage ? errorId : undefined"
                @change="
                    handleChange($event);
                    emits('change', $event.target.files);
                "
                @blur="
                    handleBlur($event);
                    emits('blur', $event);
                "
            />
        </div>
        <AnimatePresence multiple as="div" mode="wait">
            <slot name="hint" :error-message="errorMessage">
                <motion.p v-if="hint && !errorMessage" :variants initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="formHintVariants({ variant: 'hint' })">
                    {{ hint }}
                </motion.p>
            </slot>
            <slot name="errorMessage" :error-message="errorMessage">
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
    icon?: string
    hint?: string
    name: string
    id?: string
    rules?: any
    validateOnMount?: boolean
    multiple?: boolean
    accept?: string
    required?: boolean
}

const props = defineProps<Props>()

interface Emits {
    change: [files?: FileList | File | File[] | null]
    blur: [event?: FocusEvent]
}

const emits = defineEmits<Emits>()

const inputId = props.id || useId()
const errorId = `${inputId}-error`

const hasIcon = computed(() => Boolean(props.icon) || Boolean(useSlots().icon))

const { errorMessage, handleChange, handleBlur } = useField(() => props.name, props.rules, {
    label: props.label,
    validateOnMount: props.validateOnMount,
})
</script>

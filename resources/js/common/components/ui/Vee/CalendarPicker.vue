<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :class="[disabled && 'text-muted-foreground', errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        </Label>
        <Popover v-model:open="open">
            <PopoverTrigger as-child>
                <InputControl>
                    <button
                        :id="inputId"
                        type="button"
                        :disabled="disabled"
                        class="flex h-8.5 md:h-7.5 w-full items-center gap-2 border-0 bg-transparent rounded-[inherit] px-3 text-left text-base md:text-sm leading-8.5 md:leading-7.5 outline-none ring-0 focus:outline-none focus:ring-0"
                        :aria-invalid="!!errorMessage"
                        :aria-describedby="errorMessage ? errorId : undefined"
                    >
                        <Icon name="icon-calendar-days" class="size-4 text-muted-foreground shrink-0" />
                        <span v-if="displayValue" class="truncate">{{ displayValue }}</span>
                        <span v-else class="text-muted-foreground/72 truncate">{{ placeholder || __('form.select_date') }}</span>
                    </button>
                </InputControl>
            </PopoverTrigger>
            <PopoverContent align="start" class="w-auto p-3">
                <FullCalendar
                    :model-value="dateValue"
                    :min-date="minDate"
                    :max-date="maxDate"
                    header-class="px-1"
                    @update:model-value="onDateSelect"
                />
            </PopoverContent>
        </Popover>
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
import { formHintVariants } from '../Form/variants'
import { format, parse } from 'date-fns'
import { AnimatePresence, motion } from 'motion-v'
import { useField } from 'vee-validate'
import { computed, ref, useId } from 'vue'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props {
    label?: string
    hint?: string
    disabled?: boolean
    modelValue?: string | null
    name?: string
    id?: string
    rules?: any
    validateOnMount?: boolean
    placeholder?: string
    required?: boolean
    minDate?: Date | null
    maxDate?: Date | null
    displayFormat?: string
    valueFormat?: string
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    displayFormat: 'dd/MM/yyyy',
    valueFormat: 'yyyy-MM-dd',
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const inputId = props.id || useId()
const errorId = `${inputId}-error`
const open = ref(false)

const { errorMessage, value } = useField(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
})

const dateValue = computed(() => {
    if (!value.value) return null
    try {
        return parse(value.value as string, props.valueFormat, new Date())
    } catch {
        return null
    }
})

const displayValue = computed(() => {
    if (!dateValue.value) return ''
    return format(dateValue.value, props.displayFormat)
})

const onDateSelect = (date: Date | null) => {
    if (!date) return
    const formatted = format(date, props.valueFormat)
    value.value = formatted
    emit('update:modelValue', formatted)
    open.value = false
}
</script>

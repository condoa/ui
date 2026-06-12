<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :class="[disabled && 'text-muted-foreground', errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        </Label>
        <div class="relative">
            <slot name="icon">
                <span v-if="hasIcon" class="absolute inset-y-0 left-3 flex items-center justify-center">
                    <Icon v-if="icon" :name="icon" class="size-4 text-muted-foreground"></Icon>
                </span>
            </slot>
            <Datepicker v-bind="datePickerProps" v-model="value" :dark="isDark" locale="pt-BR" is-24 :format="formatDate" month-name-format="long" horizontal auto-apply>
                <template #arrow-up><Icon name="icon-chevron-up"></Icon></template>
                <template #arrow-right><Icon name="icon-chevron-right"></Icon></template>
                <template #arrow-down><Icon name="icon-chevron-down"></Icon></template>
                <template #arrow-left><Icon name="icon-chevron-left"></Icon></template>

                <template #dp-input="{ value, onInput, onEnter, onTab, onClear, onBlur, onKeypress, onPaste, isMenuOpen }">
                    <Input :id="inputId" readonly :required="required" :model-value="value" :name="name" :disabled="disabled" v-bind="$attrs" :class="[hasIcon && 'pl-9']" :placeholder="placeholder" :aria-invalid="!!errorMessage" :aria-describedby="errorMessage ? errorId : undefined" />
                </template>
                <!-- <template #action-extra="{ selectCurrentDate }">
                    <GradientDivider />
                </template>
                <template #action-row="{ internalModelValue, selectDate }">
                    <div class="flex justify-between items-center w-full">
                        <p class="current-selection">{{ formatDate(internalModelValue) }}</p>
                        <Button type="button" size="xs" @click="selectDate">Selecionar</Button>
                    </div>
                </template> -->
                <!-- <template #header-title="{ title }">
                    <div class="inline-flex items-center gap-1">
                        {{ title }} <Icon name="icon-chevron-down" class="size-4"></Icon>
                    </div>
                </template>
                <template #default="{ inputValue, inputEvents }">
                    <Input :id="inputId" :readonly="readonly" :required="required" :model-value="inputValue" :name="name" :disabled="disabled" v-bind="$attrs" :class="[hasIcon && 'pl-9']" :placeholder="placeholder" v-on="inputEvents" />
                </template> -->
            </Datepicker>
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
import Datepicker from '../Datepicker.vue'
import { formHintVariants } from '../Form/variants'
import { useMutationObserver } from '@vueuse/core'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'motion-v'
import { useField } from 'vee-validate'
import { computed, ref, useId, useSlots } from 'vue'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props {
    label?: string
    icon?: string
    hint?: string
    disabled?: boolean
    modelValue?: any
    name?: string
    id?: string
    rules?: any
    validateOnMount?: boolean
    placeholder?: string
    readonly?: boolean
    datePickerProps?: any
    required?: boolean
}

const props = withDefaults(defineProps<Props>(), { icon: 'icon-calendar-days' })

const inputId = props.id || useId()
const errorId = `${inputId}-error`

const isDark = ref(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))

useMutationObserver(
    typeof document !== 'undefined' ? document.documentElement : null,
    () => {
        isDark.value = document.documentElement.classList.contains('dark')
    },
    { attributes: true, attributeFilter: ['class'] },
)

const hasIcon = computed(() => Boolean(props.icon) || Boolean(useSlots().icon))

const { errorMessage, value } = useField(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
})

const formatDate = (date: Date) => {
    if (props.datePickerProps?.enableTimePicker === false) {
        return format(date, 'dd/MM/yyyy')
    }
    return format(date, 'dd/MM/yyyy - HH:mm')
}
</script>

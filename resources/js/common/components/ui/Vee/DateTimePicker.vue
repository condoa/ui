<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :class="[disabled && 'text-muted-foreground', errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        </Label>
        <Dialog v-model:open="open">
            <DialogTrigger as-child>
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
                        <span v-else class="text-muted-foreground/72 truncate">{{ placeholder || __('form.select_date_time') }}</span>
                    </button>
                </InputControl>
            </DialogTrigger>
            <DialogContent :show-close-button="false" class="max-w-sm p-0">
                <div class="p-3">
                    <FullCalendar
                        :model-value="dateValue"
                        :min-date="minDate"
                        :max-date="maxDate"
                        header-class="px-1"
                        @update:model-value="onDateSelect"
                    />
                </div>
                <Separator />
                <div class="flex items-center gap-3 px-3 py-2.5">
                    <Icon name="icon-clock" class="size-4 text-muted-foreground shrink-0" />
                    <InputControl class="w-auto">
                        <input
                            type="text"
                            inputmode="numeric"
                            :maxlength="2"
                            v-model="hoursText"
                            placeholder="00"
                            class="h-7.5 md:h-6.5 w-12 border-0 bg-transparent text-center text-sm leading-7.5 md:leading-6.5 outline-none ring-0 focus:outline-none focus:ring-0"
                            @focus="($event.target as HTMLInputElement).select()"
                            @blur="commitHours"
                            @keydown.enter="commitHours"
                        />
                    </InputControl>
                    <span class="text-sm font-medium text-muted-foreground">:</span>
                    <InputControl class="w-auto">
                        <input
                            type="text"
                            inputmode="numeric"
                            :maxlength="2"
                            v-model="minutesText"
                            placeholder="00"
                            class="h-7.5 md:h-6.5 w-12 border-0 bg-transparent text-center text-sm leading-7.5 md:leading-6.5 outline-none ring-0 focus:outline-none focus:ring-0"
                            @focus="($event.target as HTMLInputElement).select()"
                            @blur="commitMinutes"
                            @keydown.enter="commitMinutes"
                        />
                    </InputControl>
                    <span class="text-xs text-muted-foreground ml-auto">{{ displayValue || '--/--/---- - --:--' }}</span>
                </div>
            </DialogContent>
        </Dialog>
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
import { format, isValid, parse, set } from 'date-fns'
import { AnimatePresence, motion } from 'motion-v'
import { useField } from 'vee-validate'
import { computed, ref, useId, watch } from 'vue'

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
    displayFormat: 'dd/MM/yyyy - HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm',
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

const internalDate = ref<Date | null>(null)
const hoursText = ref('')
const minutesText = ref('')
let skipWatch = false

const syncFromInternal = () => {
    if (internalDate.value) {
        hoursText.value = String(internalDate.value.getHours()).padStart(2, '0')
        minutesText.value = String(internalDate.value.getMinutes()).padStart(2, '0')
    } else {
        hoursText.value = ''
        minutesText.value = ''
    }
}

const parseValue = () => {
    if (skipWatch) { skipWatch = false; return }
    if (!value.value) {
        internalDate.value = null
        syncFromInternal()
        return
    }

    const raw = value.value as string

    // Try the configured format first, then fall back to common variants
    // (with-seconds, ISO 8601) so the picker is robust against backend
    // serializations that include extra precision.
    const candidates = [props.valueFormat, `${props.valueFormat}:ss`, "yyyy-MM-dd'T'HH:mm:ssXXX"]

    let parsed: Date | null = null
    for (const fmt of candidates) {
        try {
            const d = parse(raw, fmt, new Date())
            if (isValid(d)) {
                parsed = d
                break
            }
        } catch {
            // try next format
        }
    }

    if (!parsed) {
        const fallback = new Date(raw)
        parsed = isValid(fallback) ? fallback : null
    }

    internalDate.value = parsed
    syncFromInternal()
}

parseValue()
watch(() => value.value, parseValue)

const dateValue = computed(() => internalDate.value)

const displayValue = computed(() => {
    if (!internalDate.value) return ''
    return format(internalDate.value, props.displayFormat)
})

const emitValue = () => {
    if (!internalDate.value) return
    const formatted = format(internalDate.value, props.valueFormat)
    skipWatch = true
    value.value = formatted
    emit('update:modelValue', formatted)
}

const onDateSelect = (date: Date | null) => {
    if (!date) return
    const h = internalDate.value ? internalDate.value.getHours() : 0
    const m = internalDate.value ? internalDate.value.getMinutes() : 0
    internalDate.value = set(date, { hours: h, minutes: m })
    syncFromInternal()
    emitValue()
}

const commitHours = () => {
    const raw = hoursText.value.replace(/\D/g, '')
    let h = parseInt(raw, 10)
    if (isNaN(h)) h = 0
    h = Math.max(0, Math.min(23, h))
    hoursText.value = String(h).padStart(2, '0')

    if (!internalDate.value) {
        internalDate.value = set(new Date(), { hours: h, minutes: 0, seconds: 0 })
    } else {
        internalDate.value = set(internalDate.value, { hours: h })
    }
    emitValue()
}

const commitMinutes = () => {
    const raw = minutesText.value.replace(/\D/g, '')
    let m = parseInt(raw, 10)
    if (isNaN(m)) m = 0
    m = Math.max(0, Math.min(59, m))
    minutesText.value = String(m).padStart(2, '0')

    if (!internalDate.value) {
        internalDate.value = set(new Date(), { hours: 0, minutes: m, seconds: 0 })
    } else {
        internalDate.value = set(internalDate.value, { minutes: m })
    }
    emitValue()
}
</script>

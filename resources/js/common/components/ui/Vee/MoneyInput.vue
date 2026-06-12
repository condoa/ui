<template>
    <div class="w-full">
        <Label v-if="label" :for="inputId" :class="[errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        </Label>
        <InputGroup>
            <InputGroupAddon>
                <InputGroupText>{{ currency }}</InputGroupText>
            </InputGroupAddon>
            <input
                :id="inputId"
                ref="inputEl"
                v-money3="moneyConfig"
                type="text"
                inputmode="numeric"
                :name="name"
                :disabled="disabled"
                :aria-invalid="errorMessage ? true : undefined"
                :aria-describedby="errorMessage ? errorId : undefined"
                class="h-8.5 w-full min-w-0 border-0 bg-transparent rounded-[inherit] px-3 leading-8.5 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground/72 md:h-7.5 md:leading-7.5"
                data-slot="input"
                @change="syncCents"
                @blur="onBlur"
            />
        </InputGroup>
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
import { formHintVariants } from '../Form/variants'
import { AnimatePresence, motion } from 'motion-v'
import { Money3Directive, unformat } from 'v-money3'
import { useField } from 'vee-validate'
import { onMounted, ref, useId } from 'vue'

const vMoney3 = Money3Directive

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props {
    label?: string
    hint?: string
    disabled?: boolean
    modelValue?: number | string | null
    name?: string
    id?: string
    rules?: any
    validateOnMount?: boolean
    required?: boolean
    currency?: string
}

const props = withDefaults(defineProps<Props>(), {
    currency: 'R$',
})

const emit = defineEmits<{
    'update:modelValue': [value: number | string]
}>()

defineOptions({ inheritAttrs: false })

const inputId = props.id || useId()
const errorId = `${inputId}-error`
const inputEl = ref<HTMLInputElement | null>(null)

const { errorMessage, value, handleBlur } = useField(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    validateOnMount: props.validateOnMount,
    syncVModel: true,
})

const moneyConfig = {
    decimal: ',',
    thousands: '.',
    precision: 2,
    disableNegative: true,
    allowBlank: false,
    minimumNumberOfCharacters: 0,
    focusOnRight: false,
}

const syncCents = () => {
    if (!inputEl.value) return
    const raw = unformat(inputEl.value.value, moneyConfig)
    const cents = Math.round(Number(raw) * 100)
    value.value = cents
    emit('update:modelValue', cents)
}

const onBlur = (event: Event) => {
    syncCents()
    handleBlur(event)
}

onMounted(() => {
    if (!inputEl.value) return
    const cents = Number(value.value) || 0
    inputEl.value.value = (cents / 100).toFixed(2).replace('.', ',')
})
</script>

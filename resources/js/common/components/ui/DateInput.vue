<template>
    <InputControl :class="($attrs.class as any)">
        <input
            ref="inputRef"
            type="text"
            inputmode="numeric"
            v-maska="'##/##/####'"
            :value="modelValue"
            :placeholder="placeholder"
            class="flex h-8.5 md:h-7.5 w-full border-0 bg-transparent rounded-[inherit] px-3 text-base md:text-sm leading-8.5 md:leading-7.5 outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground/72 font-mono"
            @input="onInput"
        />
    </InputControl>
</template>

<script lang="ts" setup>
import InputControl from './InputControl.vue'
import { vMaska } from 'maska/vue'
import { ref } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
    modelValue?: string
    placeholder?: string
}>(), {
    modelValue: '',
    placeholder: 'dd/mm/aaaa',
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement>()

const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

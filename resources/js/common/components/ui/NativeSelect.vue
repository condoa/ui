<template>
    <div class="relative flex">
        <select :id="id" ref="select" v-model="localModel" data-slot="native-select" :multiple="multiple" :name="name" :size="size" :placeholder="placeholder" :disabled="disabled" :required="required" v-bind="$attrs" :class="styles({ class: props.class })">
            <slot />
        </select>
        <span v-if="!multiple" class="pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50 peer-aria-invalid:text-destructive/80">
            <slot name="trailingIcon">
                <Icon :name="trailingIcon || 'icon-chevron-down'" class="size-4" aria-hidden="true"></Icon>
            </slot>
        </span>
    </div>
</template>

<script lang="ts" setup generic="T extends any">
import Icon from '@/common/components/Icon.vue'
import { type ClassValue, tv } from 'tailwind-variants'
import { onMounted, ref } from 'vue'

interface Props {
    /**
     * Custom class(es) to add to the select element.
     */
    class?: ClassValue
    /**
     * The id of the select element.
     */
    id?: string
    /**
     * The name of the select element.
     */
    name?: string
    /**
     * The placeholder text for the select element.
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
    /**
     * The current value of the select.
     */
    modelValue?: any
    /**
     * Whether multiple options can be selected.
     */
    multiple?: boolean
    /**
     * The number of visible options.
     */
    size?: number
    /**
     * Whether the select should be focused when mounted.
     */
    autofocus?: boolean
    /**
     * The icon to display at the trailing end of the select.
     */
    trailingIcon?: string
}

const props = defineProps<Props>()

defineOptions({ inheritAttrs: false })

const select = ref<HTMLSelectElement | null>(null)

interface Emits {
    'update:modelValue': [value: T]
}

defineEmits<Emits>()

const localModel = defineModel<T>()

onMounted(() => {
    if (props.autofocus) {
        select.value?.focus()
    }
})

const styles = tv({
    base: 'peer inline-flex w-full cursor-pointer appearance-none items-center rounded-md border border-input bg-transparent text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 has-[option[disabled]:checked]:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
    variants: {
        multiple: {
            true: 'py-1 *:px-3 *:py-1 [&_option:checked]:bg-accent',
            false: 'h-9 ps-3 pe-8',
        },
    },
})
</script>

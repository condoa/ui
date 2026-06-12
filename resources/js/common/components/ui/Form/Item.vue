<template>
    <div :class="styles({ class: props.class })" v-bind="$attrs">
        <slot name="label">
            <Label v-if="label || hint" :label="label" :hint="hint" />
        </slot>
        <Control>
            <slot />
        </Control>
        <slot name="description">
            <Description v-if="description" :description="description" />
        </slot>
        <slot name="errorMessage">
            <Message v-if="!hideMessage" />
        </slot>
    </div>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'
import { provide, useId } from 'vue'

import Control from './Control.vue'
import Description from './Description.vue'
import { FORM_ITEM_INJECTION_KEY } from './keys'
import Label from './Label.vue'
import Message from './Message.vue'

defineOptions({
    inheritAttrs: false
})

const id = useId()

provide(FORM_ITEM_INJECTION_KEY, id)

interface Props {
    class?: ClassValue;
    label?: string;
    description?: string;
    hint?: string;
    hideMessage?: boolean;
}

const props = defineProps<Props>()

const styles = tv({
    base: "space-y-1.5"
})
</script>

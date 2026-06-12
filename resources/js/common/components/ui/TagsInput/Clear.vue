<template>
    <TagsInputClear data-slot="tags-input-clear" v-bind="props" :class="styles({ class: props.class })">
        <slot>
            <Icon v-if="icon" :name="icon" class="h-3.5 w-3.5"></Icon>
        </slot>
    </TagsInputClear>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { TagsInputClear, type TagsInputClearProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends TagsInputClearProps {
    class?: ClassValue

    icon?: string
}

const props = withDefaults(defineProps<Props>(), { icon: 'icon-close' })

const styles = tv({
    base: 'flex items-center justify-center rounded bg-transparent p-1 opacity-40 transition hover:bg-muted-foreground hover:opacity-100 focus:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
})
</script>

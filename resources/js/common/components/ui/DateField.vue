<template>
    <DateFieldRoot v-slot="{ segments }" v-bind="props" v-model="localModel" :class="styles({ class: props.class })">
        <template v-for="item in segments" :key="item.part">
            <DateFieldInput v-if="item.part === 'literal'" :part="item.part" class="inline-flex items-center justify-center text-muted-foreground" locale="pt-BR">
                <Icon v-if="separatorIcon" :name="separatorIcon" class="text-muted-foreground"></Icon>
                <span v-else-if="separator" class="mx-1 text-muted-foreground">{{ separator }}</span>
            </DateFieldInput>
            <DateFieldInput v-else :part="item.part" class="inline-flex cursor-text items-center rounded px-1 tabular-nums transition focus:ring-1 focus:ring-ring focus:outline-none aria-[valuetext=Empty]:text-muted-foreground">
                {{ item.value }}
            </DateFieldInput>
        </template>
    </DateFieldRoot>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import type { DateValue } from '@internationalized/date'
import { DateFieldInput, DateFieldRoot } from 'reka-ui'
import type { DateFieldRootProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DateFieldRootProps {
    /** Any additional class that should be added to the date field */
    class?: ClassValue
    /**
     * The separator to use between date segments
     *
     * @default "/"
     */
    separator?: string
    /** The icon to use as a separator */
    separatorIcon?: string
}

const props = withDefaults(defineProps<Props>(), { separator: '/' })

const localModel = defineModel<DateValue>()

const styles = tv({
    base: 'h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background selection:bg-primary selection:text-primary-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground file:hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[invalid]:border-destructive dark:bg-input/30',
})
</script>

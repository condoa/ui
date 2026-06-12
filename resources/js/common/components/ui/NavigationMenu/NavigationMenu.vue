<template>
    <NavigationMenuRoot data-slot="navigation-menu" :class="styles({ class: props.class })" v-bind="forwarded" :data-viewport="viewport">
        <slot />
        <slot name="viewport">
            <NavigationMenuViewport v-if="viewport" />
        </slot>
    </NavigationMenuRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { NavigationMenuRoot, useForwardPropsEmits } from 'reka-ui'
import type { NavigationMenuRootEmits, NavigationMenuRootProps } from 'reka-ui'

interface Props extends NavigationMenuRootProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    viewport?: boolean
}

const props = withDefaults(defineProps<Props>(), { viewport: true })

const emits = defineEmits<NavigationMenuRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)

const styles = tv({
    base: 'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
})
</script>

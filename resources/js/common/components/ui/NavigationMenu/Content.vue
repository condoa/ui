<template>
    <NavigationMenuContent data-slot="navigation-menu-content" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </NavigationMenuContent>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { NavigationMenuContent, useForwardPropsEmits } from 'reka-ui'
import type { NavigationMenuContentEmits, NavigationMenuContentProps } from 'reka-ui'

interface Props extends NavigationMenuContentProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const emits = defineEmits<NavigationMenuContentEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)

const styles = tv({
    base: 'absolute top-0 left-0 w-full sm:w-auto data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight motion-reduce:[animation:none] **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
})
</script>

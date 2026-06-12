<template>
    <div class="p-1">
        <Button
            data-slot="navbar-trigger"
            variant="outline"
            :aria-label="ariaLabel"
            size="icon-sm"
            :class="styles({ class: props.class })"
            @click="
                ($event: MouseEvent) => {
                    injectedValues?.toggleNav();
                    props.onClick?.($event);
                }
            "
        >
            <Icon :name="icon" aria-hidden="true"></Icon>
            <span class="sr-only">Toggle Navbar</span>
        </Button>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { type ClassValue, tv } from 'tailwind-variants'
import { inject } from 'vue'
import { navProviderKey } from './provider'

const injectedValues = inject(navProviderKey)

if (!injectedValues) {
    throw new Error('Nav context not found. Make sure to wrap your component with <NavProvider>.')
}

interface Props {
    ariaLabel?: string
    class?: ClassValue
    onClick?: (event: MouseEvent) => void
    icon?: string
}

const props = withDefaults(defineProps<Props>(), {
    ariaLabel: 'Toggle Navbar',
    icon: 'icon-menu',
})

const styles = tv({
    base: '-ml-2 min-lg:hidden',
})
</script>

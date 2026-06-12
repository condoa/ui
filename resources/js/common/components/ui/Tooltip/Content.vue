<template>
    <TooltipPortal :to="to">
        <TooltipContent data-slot="tooltip-content" v-bind="{ ...forwarded, ...$attrs }" :class="contentClass">
            <slot />
            <slot name="arrow">
                <TooltipArrow v-if="showArrow" :class="arrowClass" />
            </slot>
        </TooltipContent>
    </TooltipPortal>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { TooltipArrow, TooltipContent, useForwardPropsEmits } from 'reka-ui';
import type { TooltipContentEmits, TooltipContentProps } from 'reka-ui';
import { tv, type ClassValue } from 'tailwind-variants'
import { computed } from 'vue'

defineOptions({ inheritAttrs: false });

interface Props extends TooltipContentProps {
    to?: string | HTMLElement;
    class?: ClassValue;
    showArrow?: boolean;
    variant?: 'default' | 'dark';
    animate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    side: 'top',
    sideOffset: 4,
    align: 'center',
    alignOffset: -4,
    showArrow: true,
    variant: 'dark',
    avoidCollisions: true,
    collisionBoundary: () => [],
    collisionPadding: 0,
    sticky: 'partial',
    animate: true,
});

const emits = defineEmits<TooltipContentEmits>();

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class', 'to', 'showArrow', 'variant', 'animate'), emits);

const contentClass = computed(() => styles({ variant: props.variant, animate: props.animate, class: props.class as any }) as unknown as string);
const arrowClass = computed(() => arrowStyles({ variant: props.variant }) as unknown as string);

const styles = tv({
    base: 'relative z-50 max-w-70 rounded-md border px-3 py-1.5 text-xs',
    variants: {
        variant: {
            default: 'bg-popover text-popover-foreground border-border',
            dark: 'bg-primary text-primary-foreground border-primary',
        },
        animate: {
            true: 'animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'dark',
        animate: true,
    },
});

const arrowStyles = tv({
    base: '',
    variants: {
        variant: {
            default: 'fill-popover stroke-border',
            dark: 'fill-primary stroke-primary',
        },
    },
    defaultVariants: {
        variant: 'dark',
    },
});
</script>

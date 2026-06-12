<template>
    <SheetPortal :to="to">
        <slot name="overlay">
            <SheetOverlay :is-blurred />
        </slot>
        <AnimatePresence>
            <DialogContent
                v-if="rootContext?.open.value"
                as-child
                force-mount
                v-bind="{ ...forwarded, ...$attrs }"
            >
                <motion.div
                    data-slot="sheet-content"
                    :class="styles({ side, variant, isBlurred, class: props.class })"
                    :initial="{ ...offscreen, opacity: 0 }"
                    :animate="{ x: 0, y: 0, opacity: 1 }"
                    :exit="{ ...offscreen, opacity: 0, transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } }"
                    :transition="{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.32, 0.72, 0, 1] }"
                >
                    <slot>
                        <slot name="header">
                            <SheetHeader>
                                <slot name="title">
                                    <SheetTitle v-if="title" :title="title" />
                                </slot>
                                <slot name="description">
                                    <SheetDescription v-if="description" :description="description" />
                                </slot>
                            </SheetHeader>
                        </slot>
                        <ScrollArea class="min-h-0 flex-1">
                            <slot name="content" />
                        </ScrollArea>
                        <slot name="footer" />
                    </slot>
                    <slot name="close">
                        <SheetX :icon="icon" />
                    </slot>
                </motion.div>
            </DialogContent>
        </AnimatePresence>
    </SheetPortal>
</template>

<script lang="ts" setup>
import { reactiveOmit } from "@vueuse/core";
import { AnimatePresence, motion, useReducedMotion } from "motion-v";
import {
	DialogContent,
	injectDialogRootContext,
	useForwardPropsEmits,
} from "reka-ui";
import type { DialogContentEmits, DialogContentProps } from "reka-ui";
import { type ClassValue, tv, type VariantProps } from "tailwind-variants";
import { computed } from "vue";

const prefersReducedMotion = useReducedMotion();

defineOptions({ inheritAttrs: false });

interface Props extends DialogContentProps {
	icon?: string;
	title?: string;
	description?: string;
	class?: ClassValue;
	side?: VariantProps<typeof styles>["side"];
	variant?: VariantProps<typeof styles>["variant"];
	to?: string | HTMLElement;
	isBlurred?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	isBlurred: true,
	variant: "inset",
});

const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(
	reactiveOmit(
		props,
		"icon",
		"title",
		"description",
		"class",
		"to",
		"side",
		"variant",
		"isBlurred",
		"asChild",
		"forceMount",
	),
	emits,
);

const rootContext = injectDialogRootContext();

const offscreen = computed(() => {
	if (prefersReducedMotion.value) {
		return { x: 0, y: 0 };
	}
	switch (props.side ?? "left") {
		case "right":
			return { x: 32, y: 0 };
		case "top":
			return { x: 0, y: -32 };
		case "bottom":
			return { x: 0, y: 32 };
		default:
			return { x: -32, y: 0 };
	}
});

const styles = tv({
	base: "fixed z-50 flex flex-col overflow-hidden bg-background shadow-lg",
	variants: {
		side: {
			top: "inset-x-0 top-0 h-auto border-b",
			bottom: "inset-x-0 bottom-0 h-auto border-t",
			left: "inset-y-0 left-0 h-full w-3/4 border-r md:max-w-md",
			right: "inset-y-0 right-0 h-full w-3/4 border-l md:max-w-md",
		},
		variant: {
			default: "",
			inset: "",
		},
		isBlurred: {
			true: "backdrop-blur-sm",
			false: "backdrop-blur-none",
		},
	},
	compoundVariants: [
		{
			side: "top",
			variant: "inset",
			class:
				"sm:inset-x-4 sm:top-4 sm:rounded-md sm:border sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-md)-1px)]",
		},
		{
			side: "bottom",
			variant: "inset",
			class:
				"sm:inset-x-4 sm:bottom-4 sm:rounded-md sm:border sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-md)-1px)]",
		},
		{
			side: "left",
			variant: "inset",
			class:
				"sm:inset-y-4 sm:left-4 sm:h-[calc(100%-2rem)] sm:rounded-md sm:border sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-md)-1px)]",
		},
		{
			side: "right",
			variant: "inset",
			class:
				"sm:inset-y-4 sm:right-4 sm:h-[calc(100%-2rem)] sm:rounded-md sm:border sm:**:data-[slot=sheet-footer]:rounded-b-[calc(var(--radius-md)-1px)]",
		},
	],
	defaultVariants: {
		side: "left",
		variant: "inset",
	},
});
</script>

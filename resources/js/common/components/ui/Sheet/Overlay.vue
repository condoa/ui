<template>
	<AnimatePresence>
		<DialogOverlay
			v-if="rootContext?.open.value"
			as-child
			force-mount
			v-bind="forwarded"
		>
			<motion.div
				data-slot="sheet-overlay"
				:class="styles({ isBlurred, class: props.class })"
				:initial="{ opacity: 0 }"
				:animate="{ opacity: 1 }"
				:exit="{ opacity: 0 }"
				:transition="{ duration: prefersReducedMotion ? 0 : 0.15, ease: [0.25, 0.1, 0.25, 1] }"
			/>
		</DialogOverlay>
	</AnimatePresence>
</template>

<script lang="ts" setup>
import { reactiveOmit } from "@vueuse/core";
import { AnimatePresence, motion, useReducedMotion } from "motion-v";
import { DialogOverlay, injectDialogRootContext } from "reka-ui";
import type { DialogOverlayProps } from "reka-ui";
import { type ClassValue, tv } from 'tailwind-variants'

const prefersReducedMotion = useReducedMotion();

interface Props extends DialogOverlayProps {
	/** Custom class(es) to add to parent element */
	class?: ClassValue;
	isBlurred?: boolean;
}

const props = withDefaults(defineProps<Props>(), { isBlurred: true });

const forwarded = reactiveOmit(props, "class", "isBlurred", "asChild", "forceMount");

const rootContext = injectDialogRootContext();

const styles = tv({
	base: "fixed inset-0 z-50 bg-background/50",
	variants: {
		isBlurred: {
			true: "backdrop-blur-sm",
			false: "backdrop-blur-none",
		},
	},
});
</script>

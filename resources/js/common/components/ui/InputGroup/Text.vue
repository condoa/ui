<template>
    <span :class="styles({ class: props.class })">
        <slot />
    </span>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
	/** Additional classes to add to the text */
	class?: ClassValue;
}

const props = defineProps<Props>();

const styles = tv({
	base: [
		"line-clamp-1 flex items-center gap-2 text-muted-foreground leading-none",
		"in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*=size-])]:size-4.5",
		"sm:in-[[data-slot=input-group]:has([data-slot=input-control],[data-slot=textarea-control])]:[&_svg:not([class*=size-])]:size-4",
		"[&_svg]:pointer-events-none",
	],
});
</script>

<template>
    <AvatarImage data-slot="avatar-image" v-bind="forwarded" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { AvatarImage, useForwardPropsEmits } from "reka-ui"
import type { AvatarImageEmits, AvatarImageProps } from "reka-ui"
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends AvatarImageProps {
    /** The alt text for the image */
    alt?: string;
    /** Custom class(es) to add to the element */
    class?: ClassValue;
}

const props = defineProps<Props>()

const emits = defineEmits<AvatarImageEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, "class"), emits)

const styles = tv({
    base: "aspect-square size-full object-cover",
})
</script>

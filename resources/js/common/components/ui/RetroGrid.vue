<template>
    <Primitive
        :as
        :as-child
        aria-hidden="true"
        :class="styles({ class: props.class })"
        :style="
            {
                '--grid-angle': `${angle}deg`,
                '--cell-size': `${cellSize}px`,
                '--opacity': opacity,
                '--light-line': lightLineColor,
                '--dark-line': darkLineColor,
            }
        "
    >
        <div class="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
            <div class="[inset:0%_0px] [margin-left:-200%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] animate-grid motion-reduce:animate-none [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-size:var(--cell-size)_var(--cell-size)] [background-repeat:repeat] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </Primitive>
</template>

<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

export type RetroGridProps = PrimitiveProps & {
    class?: ClassValue

    /**
     * @default 65
     */
    angle?: number

    /**
     * @default 60
     */
    cellSize?: number

    /**
     * @default 0.5
     */
    opacity?: number

    /**
     * @default "gray"
     */
    lightLineColor?: string

    /**
     * @default "gray"
     */
    darkLineColor?: string
}

const props = withDefaults(defineProps<RetroGridProps>(), {
    angle: 65,
    cellSize: 60,
    opacity: 0.5,
    lightLineColor: 'gray',
    darkLineColor: 'gray',
})

const styles = tv({
    base: ['pointer-events-none absolute size-full overflow-hidden [perspective:200px]', 'opacity-[var(--opacity)]'],
})
</script>

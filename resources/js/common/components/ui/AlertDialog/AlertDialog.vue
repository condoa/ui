<template>
    <AlertDialogRoot data-slot="alert-dialog" v-bind="forwarded">
        <slot>
            <slot name="trigger">
                <AlertDialogTrigger v-if="triggerText" as-child>
                    <Button variant="outline">{{ triggerText }}</Button>
                </AlertDialogTrigger>
            </slot>
            <slot name="content">
                <AlertDialogContent>
                    <slot name="header">
                        <AlertDialogHeader>
                            <slot name="title">
                                <AlertDialogTitle v-if="title" :title="title" />
                            </slot>
                            <slot name="description">
                                <AlertDialogDescription v-if="description" :description="description" />
                            </slot>
                        </AlertDialogHeader>
                    </slot>
                    <slot name="footer">
                        <AlertDialogFooter>
                            <slot name="cancel">
                                <AlertDialogCancel />
                            </slot>
                            <slot name="action">
                                <AlertDialogAction />
                            </slot>
                        </AlertDialogFooter>
                    </slot>
                </AlertDialogContent>
            </slot>
        </slot>
    </AlertDialogRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogRoot, useForwardPropsEmits } from 'reka-ui'
import type { AlertDialogEmits, AlertDialogProps } from 'reka-ui'

interface Props extends AlertDialogProps {
    /** Text to display in the trigger button */
    triggerText?: string
    /** Text to be passed to the `AlertDialogTitle` */
    title?: string
    /** Text to be passed to the `AlertDialogDescription` */
    description?: string
}

const props = defineProps<Props>()

const emits = defineEmits<AlertDialogEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'description', 'title', 'triggerText'), emits)
</script>
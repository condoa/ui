<template>
    <VueDatePicker ref="datepickerRef" v-bind="$attrs">
        <template v-for="(_, slot) in $slots" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>
    </VueDatePicker>
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import { useTemplateRef } from 'vue'

defineOptions({
    inheritAttrs: false,
})

const datepickerRef = useTemplateRef('datepickerRef')

interface Props {
    /**
     * Whether to trim weeks that don't have any days in the current month.
     */
    trimWeeks?: boolean
}

defineProps<Props>()

defineExpose({ datepickerRef })
</script>

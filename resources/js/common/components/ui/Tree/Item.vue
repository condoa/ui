<template>
    <TreeItem v-slot="slotProps" data-slot="tree-item" v-bind="forwarded">
        <slot v-bind="slotProps" />
    </TreeItem>
</template>

<script lang="ts" setup generic="T extends Record<string, any>">
import { TreeItem, useForwardPropsEmits } from 'reka-ui'
import type { TreeItemEmits, TreeItemProps } from 'reka-ui'

const props = defineProps<TreeItemProps<T>>()

const emit = defineEmits<TreeItemEmits<T>>()

// reka-ui >= 2.9.3 tightened generic prop forwarding so this helper's return is
// inferred as an all-optional mapped type that no longer satisfies TreeItem's
// required `value`/`level`. The runtime object is unchanged (v-bind unwraps the
// ref and forwards every prop and emit listener); assert the props shape back so
// the wrapper type-checks on current reka-ui.
const forwarded = useForwardPropsEmits(props, emit) as unknown as TreeItemProps<T>
</script>

import { type InjectionKey, type Ref, inject, provide, ref, watch } from 'vue'

interface DialogNestingContext {
    nestedCount: Ref<number>
    depth: number
}

export const dialogNestingKey = Symbol('dialog-nesting-parent') as InjectionKey<DialogNestingContext>
export const dialogNestedCountKey = Symbol('dialog-nested-count') as InjectionKey<Ref<number>>
export const dialogDepthKey = Symbol('dialog-depth') as InjectionKey<number>

export function useDialogNesting(open: Ref<boolean>) {
    const parentContext = inject(dialogNestingKey, null)
    const depth = parentContext ? parentContext.depth + 1 : 0

    const nestedCount = ref(0)

    provide(dialogNestingKey, { nestedCount, depth })
    provide(dialogNestedCountKey, nestedCount)
    provide(dialogDepthKey, depth)

    if (parentContext) {
        watch(open, (isOpen) => {
            parentContext.nestedCount.value += isOpen ? 1 : -1
        })
    }

    return { nestedCount, depth }
}

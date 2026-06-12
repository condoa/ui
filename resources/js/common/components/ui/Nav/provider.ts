import type { ComputedRef, InjectionKey, ModelRef } from 'vue'

export const navProviderKey = Symbol() as InjectionKey<{
    open: ModelRef<boolean, string, boolean, boolean>
    isMobile: ComputedRef<boolean>
    toggleNav: () => void
}>

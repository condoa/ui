import { tv } from 'tailwind-variants'

export const formHintVariants = tv({
    base: 'mt-0.5 leading-none text-sm border-transparent p-0 bg-transparent',
    variants: {
        variant: {
            hint: 'text-muted-foreground',
            error: 'text-destructive',
            warning: 'text-amber-600',
        },
    },
    defaultVariants: {
        variant: 'hint',
    },
})

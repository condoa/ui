import { tv, type VariantProps } from 'tailwind-variants'

export const buttonStyles = tv({
    base: [
        '[&_svg]:-mx-0.5 relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium text-base outline-none transition-shadow',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)]',
        'pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-64',
        'md:text-sm',
        "[&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 md:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    ],
    variants: {
        variant: {
            default:
                'not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-primary bg-primary text-primary-foreground shadow-primary/24 shadow-xs active:inset-shadow-[0_1px_--theme(--color-black/8%)] disabled:shadow-none active:shadow-none hover:bg-primary/90',
            primary:
                'not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-primary bg-primary text-primary-foreground shadow-primary/24 shadow-xs active:inset-shadow-[0_1px_--theme(--color-black/8%)] disabled:shadow-none active:shadow-none hover:bg-primary/90',
            destructive:
                'not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-destructive bg-destructive text-white shadow-destructive/24 shadow-xs active:inset-shadow-[0_1px_--theme(--color-black/8%)] disabled:shadow-none active:shadow-none hover:bg-destructive/90',
            destructiveoutline:
                'border-input bg-popover not-dark:bg-clip-padding text-destructive-foreground shadow-xs/5 not-disabled:not-active:before:shadow-[0_1px_--theme(--color-black/4%)] dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:before:shadow-[0_-1px_--theme(--color-white/6%)] disabled:shadow-none active:shadow-none hover:border-destructive/32 hover:bg-destructive/4',
            outline:
                'border-input bg-popover not-dark:bg-clip-padding text-foreground shadow-xs/5 not-disabled:not-active:before:shadow-[0_1px_--theme(--color-black/4%)] dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:before:shadow-[0_-1px_--theme(--color-white/6%)] disabled:shadow-none active:shadow-none hover:bg-accent/50 dark:hover:bg-input/64',
            secondary:
                'border-transparent bg-secondary text-secondary-foreground active:bg-secondary/80 hover:bg-secondary/90',
            ghost:
                'border-transparent text-foreground hover:bg-accent active:bg-accent',
            link:
                'border-transparent underline-offset-4 hover:underline',
        },
        effect: {
            expandIcon: 'group relative gap-0',
            ringHover: 'transition-all duration-300 hover:ring-3 hover:ring-ring/50',
            shine: 'relative overflow-hidden [background-position:0s_ease] before:absolute before:inset-0 before:animate-shine before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat',
            shineHover:
                'relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0]',
            gooeyRight:
                'relative z-0 overflow-hidden duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:from-white/40 before:transition-transform before:duration-1000 hover:before:translate-x-[0%] hover:before:translate-y-[0%]',
            gooeyLeft:
                'relative z-0 overflow-hidden duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:from-white/40 after:transition-transform after:duration-1000 hover:after:translate-x-[0%] hover:after:translate-y-[0%]',
            underline:
                'relative !no-underline after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0',
            hoverUnderline:
                'relative !no-underline after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100',
            gradientSlideShow:
                'animate-gradient-flow bg-[linear-gradient(-45deg,var(--gradient-lime),var(--gradient-ocean),var(--gradient-wine),var(--gradient-rust))] bg-[size:400%] text-white',
        },
        size: {
            xs: "h-7 gap-1 rounded-md px-[calc(--spacing(2)-1px)] text-sm before:rounded-[calc(var(--radius-md)-1px)] md:h-6 md:text-xs [&_svg:not([class*='size-'])]:size-4 md:[&_svg:not([class*='size-'])]:size-3.5",
            sm: "h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] md:h-7",
            default: 'h-9 px-[calc(--spacing(3)-1px)] md:h-8',
            lg: 'h-10 px-[calc(--spacing(3.5)-1px)] md:h-9',
            xl: "h-11 px-[calc(--spacing(4)-1px)] text-lg md:h-10 md:text-base [&_svg:not([class*='size-'])]:size-5 md:[&_svg:not([class*='size-'])]:size-4.5",
            icon: 'size-9 md:size-8',
            'icon-xs': "size-7 rounded-md before:rounded-[calc(var(--radius-md)-1px)] md:size-6 not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-4 md:not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-3.5",
            'icon-sm': 'size-8 md:size-7',
            'icon-lg': 'size-10 md:size-9',
            'icon-xl': "size-11 md:size-10 [&_svg:not([class*='size-'])]:size-5 md:[&_svg:not([class*='size-'])]:size-4.5",
        },
        disabled: {
            true: 'pointer-events-none opacity-64',
        },
        hasIcon: {
            false: '',
            true: 'gap-1',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
})

export type ButtonProps = VariantProps<typeof buttonStyles>

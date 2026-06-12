<template>
    <nav data-slot="breadcrumb" aria-label="breadcrumb" :class="styles({ class: props.class })">
        <template v-for="(item, i) in items" :key="i">
            <slot :name="item.slot || 'default'">
                <div data-slot="breadcrumb-item" class="flex items-center gap-3 min-w-0 shrink">
                    <div class="group flex items-center gap-2 min-w-0">
                        <slot name="crumbIcon" :item="item" :index="i">
                            <Icon
                                v-if="item.icon"
                                aria-hidden="true"
                                :name="item.icon"
                                class="size-3.5 shrink-0"
                                :class="[
                                    isNotLastItem(i)
                                        ? 'text-muted-foreground group-hover:text-foreground'
                                        : 'text-foreground',
                                ]"
                            ></Icon>
                        </slot>
                        <slot :item="item" :is-not-last-item="isNotLastItem" :index="i" name="link">
                            <Link
                                v-if="item.label && item.link"
                                :href="!item?.disabled ? item.link : ''"
                                data-slot="breadcrumb-label"
                                :class="[
                                    item.link && !item.disabled && 'underline-offset-2 group-hover:underline',
                                    isNotLastItem(i)
                                        ? 'text-muted-foreground group-hover:text-foreground'
                                        : 'font-medium text-primary',
                                ]"
                                class="text-sm text-foreground block truncate"
                                @click="item?.click?.()"
                            >
                                {{ item.label }}
                            </Link>
                            <span
                                v-else-if="item.label"
                                class="block truncate"
                                :aria-current="!isNotLastItem(i) ? 'page' : undefined"
                                :class="[
                                    isNotLastItem(i)
                                        ? 'text-muted-foreground group-hover:text-foreground'
                                        : 'font-medium text-foreground',
                                ]"
                            >
                                {{ item.label }}
                            </span>
                        </slot>
                    </div>
                </div>
            </slot>
            <slot name="separator" :item="item" :index="i">
                <Icon v-if="isNotLastItem(i)" aria-hidden="true" data-slot="breadcrumb-separator" :name="separator" class="h-3 w-3 shrink-0 text-muted-foreground"></Icon>
            </slot>
        </template>
    </nav>
</template>

<script setup lang="ts">
import Icon from '@/common/components/Icon.vue'
import { Link } from '@inertiajs/vue3'
import { type ClassValue, tv } from 'tailwind-variants'

export interface BreadcrumbItem {
    label?: string
    icon?: string
    link?: string
    disabled?: boolean
    slot?: string
    click?: () => void
}

interface Props {
    /** The items to display in the breadcrumbs */
    items?: BreadcrumbItem[]
    /** The separator to use between each breadcrumb */
    separator?: string
    /** Custom class(es) to add to the parent element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    separator: 'icon-chevron-right',
    items: () => [],
})

const isNotLastItem = (index: number) => index !== props.items.length - 1

const styles = tv({
    base: 'flex w-full md:w-auto md:flex-1 items-center gap-1.5 text-sm min-w-0 sm:gap-2.5',
})
</script>

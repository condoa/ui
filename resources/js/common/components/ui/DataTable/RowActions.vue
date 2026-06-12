<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon-sm">
                <Icon name="icon-ellipsis" class="size-4" />
                <span class="sr-only">Abrir menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <slot />
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
</script>

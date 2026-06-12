<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { showToast, toastId } from '@/common/toast/showToast'

withDefaults(
    defineProps<{
        variant?: 'outline' | 'ghost' | 'primary' | 'secondary'
        size?: 'sm' | 'xs' | 'default'
        label?: string
    }>(),
    {
        variant: 'outline',
        size: 'sm',
    },
)

const http = useHttp<{ url: string }, { short_url: string }>({ url: '' })

const share = async () => {
    http.url = window.location.href
    http.post(route('short-urls.store'), {
        onSuccess: async (response) => {
            await navigator.clipboard.writeText(response.short_url)
            showToast({ id: toastId(), type: 'success', title: __('form.link_copied') })
        },
        onError: () => {
            showToast({ id: toastId(), type: 'error', title: __('form.share_failed') })
            return false
        },
    })
}
</script>

<template>
    <Button :variant="variant" :size="size" :disabled="http.processing" @click="share">
        <Icon :name="http.processing ? 'icon-loading' : 'icon-link'" class="size-4" />
        <template v-if="label">{{ label }}</template>
    </Button>
</template>

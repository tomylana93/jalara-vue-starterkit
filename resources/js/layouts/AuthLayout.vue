<script setup lang="ts">
import AuthLayout from '@/layouts/auth/AuthSimpleLayout.vue';
import { useTrans } from '@/composables/useTrans';
import type { TextMessageKey } from '@/types';
const { trans } = useTrans();
const {
    title = '',
    description = '',
    titleKey,
    descriptionKey,
} = defineProps<{
    title?: string;
    description?: string;
    titleKey?: TextMessageKey;
    descriptionKey?: TextMessageKey;
}>();
</script>
<template>
    <AuthLayout
        :title="title || (titleKey ? trans(titleKey) : '')"
        :description="
            description || (descriptionKey ? trans(descriptionKey) : '')
        "
        ><slot
    /></AuthLayout>
</template>

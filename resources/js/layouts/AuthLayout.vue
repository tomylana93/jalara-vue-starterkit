<script setup lang="ts">
import AppearanceMenu from '@/components/AppearanceMenu.vue';
import AuthLayout from '@/layouts/auth/AuthSplitLayout.vue';
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
    <div class="relative">
        <header class="absolute top-4 right-4 z-20">
            <AppearanceMenu />
        </header>
        <AuthLayout
            :title="title || (titleKey ? trans(titleKey) : '')"
            :description="
                description || (descriptionKey ? trans(descriptionKey) : '')
            "
            ><slot
        /></AuthLayout>
    </div>
</template>

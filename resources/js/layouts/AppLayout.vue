<script setup lang="ts">
import { computed } from 'vue';
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import { useTrans } from '@/composables/useTrans';
import type { BreadcrumbItem } from '@/types';
import type { TextMessageKey } from '@/types';
const { trans } = useTrans();
const { breadcrumbs = [], breadcrumbKeys = [] } = defineProps<{
    breadcrumbs?: BreadcrumbItem[];
    breadcrumbKeys?: {
        titleKey: TextMessageKey;
        href: BreadcrumbItem['href'];
    }[];
}>();
const translatedBreadcrumbs = computed(() =>
    breadcrumbKeys.length
        ? breadcrumbKeys.map(({ titleKey, href }) => ({
              title: trans(titleKey),
              href,
          }))
        : breadcrumbs,
);
</script>
<template>
    <AppLayout :breadcrumbs="translatedBreadcrumbs"><slot /></AppLayout>
</template>

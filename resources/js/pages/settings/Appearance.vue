<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { Head } from '@inertiajs/vue3';
import AppearanceTabs from '@/components/AppearanceTabs.vue';
import Heading from '@/components/Heading.vue';
import { edit } from '@/routes/appearance';

const { trans } = useTrans();
defineOptions({
    layout: {
        breadcrumbKeys: [
            {
                titleKey: 'appearance.heading.settings',
                href: edit(),
            },
        ],
    },
});
</script>

<template>
    <Head :title="trans('appearance.heading.settings')" />

    <h1 class="sr-only">{{ trans('appearance.heading.settings') }}</h1>

    <div class="space-y-6">
        <Heading
            variant="small"
            :title="trans('appearance.heading.settings')"
            :description="trans('appearance.description.settings')"
        />
        <AppearanceTabs />
    </div>
</template>

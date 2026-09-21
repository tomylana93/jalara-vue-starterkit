<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { useTrans } from '@/composables/useTrans';
import { cn, toUrl } from '@/lib/utils';
import { edit as editGeneralSettings } from '@/routes/settings/general';
import type { NavItem } from '@/types';

const { trans } = useTrans();
const sidebarNavItems = computed<NavItem[]>(() => [
    {
        title: trans('navigation.label.general'),
        href: editGeneralSettings(),
    },
]);

const { isCurrentOrParentUrl } = useCurrentUrl();
</script>

<template>
    <div class="px-4 py-6">
        <Heading
            :title="trans('general_settings.heading.settings')"
            :description="trans('general_settings.description.settings')"
        />

        <div class="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <aside class="w-full max-w-xl lg:w-48">
                <nav
                    class="flex flex-col gap-1"
                    :aria-label="trans('general_settings.heading.settings')"
                >
                    <Button
                        v-for="item in sidebarNavItems"
                        :key="toUrl(item.href)"
                        variant="ghost"
                        :class="
                            cn('w-full justify-start', {
                                'bg-muted': isCurrentOrParentUrl(item.href),
                            })
                        "
                        as-child
                    >
                        <Link :href="item.href">
                            {{ item.title }}
                        </Link>
                    </Button>
                </nav>
            </aside>

            <Separator class="lg:hidden" />

            <div class="flex-1 md:max-w-2xl">
                <section class="max-w-xl">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>

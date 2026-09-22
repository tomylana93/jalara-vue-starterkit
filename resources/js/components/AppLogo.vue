<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';

const page = usePage();
const name = computed(() => page.props.name);
const logoFull = computed(() => page.props.brand?.logoFull ?? null);
</script>

<template>
    <div class="flex min-w-0 items-center gap-2">
        <img
            v-if="logoFull"
            :src="logoFull"
            :alt="name"
            class="h-8 max-w-36 object-contain object-left"
        />
        <template v-else>
            <div
                class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md"
            >
                <AppLogoIcon
                    class="size-5 fill-current text-white dark:text-black"
                />
            </div>
            <div class="grid flex-1 text-left text-sm">
                <span class="mb-0.5 truncate leading-tight font-semibold">{{
                    name
                }}</span>
            </div>
        </template>
    </div>
</template>

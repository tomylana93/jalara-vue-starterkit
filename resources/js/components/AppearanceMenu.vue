<script setup lang="ts">
import { Monitor, Moon, Sun } from '@lucide/vue';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/composables/useAppearance';
import { useTrans } from '@/composables/useTrans';

const { appearance, updateAppearance } = useAppearance();
const { trans } = useTrans();
const options = computed(
    () =>
        [
            {
                value: 'light',
                icon: Sun,
                label: trans('appearance.label.light'),
            },
            {
                value: 'dark',
                icon: Moon,
                label: trans('appearance.label.dark'),
            },
            {
                value: 'system',
                icon: Monitor,
                label: trans('appearance.label.system'),
            },
        ] as const,
);
const activeIcon = computed(
    () =>
        options.value.find((option) => option.value === appearance.value)
            ?.icon ?? Monitor,
);
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="ghost"
                size="icon"
                :aria-label="trans('appearance.heading.settings')"
            >
                <component :is="activeIcon" aria-hidden="true" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup :model-value="appearance">
                <DropdownMenuRadioItem
                    v-for="option in options"
                    :key="option.value"
                    :value="option.value"
                    @select="updateAppearance(option.value)"
                >
                    <component :is="option.icon" aria-hidden="true" />
                    {{ option.label }}
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

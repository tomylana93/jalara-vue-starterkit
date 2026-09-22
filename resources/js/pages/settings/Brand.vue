<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { update } from '@/actions/App/Http/Controllers/Settings/BrandSettingsController';
import BrandAssetUploader from '@/components/BrandAssetUploader.vue';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useTrans } from '@/composables/useTrans';
import { edit } from '@/routes/settings/brand';
import type {
    BrandAssetOption,
    BrandColorOption,
    BrandSettingsForm,
    BrandThemeTokens,
} from '@/types';

const props = defineProps<{
    settings: BrandSettingsForm;
    colorPresets: BrandColorOption[];
    themeTokens: BrandThemeTokens;
    assets: BrandAssetOption[];
}>();

const { trans } = useTrans();
const form = useForm<BrandSettingsForm>({ ...props.settings }).withPrecognition(
    update(),
);

defineOptions({
    layout: {
        breadcrumbKeys: [
            { titleKey: 'general_settings.heading.settings', href: edit() },
        ],
    },
});

function themeRule(selector: string, tokens: Record<string, string>): string {
    const declarations = Object.entries(tokens)
        .map(([token, value]) => `${token}: ${value};`)
        .join('');

    return `${selector}{${declarations}}`;
}

function applyThemeTokens(): void {
    let style = document.getElementById('brand-theme');

    if (!(style instanceof HTMLStyleElement)) {
        style = document.createElement('style');
        style.id = 'brand-theme';
        document.head.append(style);
    }

    style.textContent = [
        themeRule(':root', props.themeTokens.light),
        themeRule('.dark', props.themeTokens.dark),
    ].join('');
}

function submit(): void {
    form.submit(update(), {
        preserveScroll: true,
        onSuccess: () => {
            applyThemeTokens();
            form.defaults();
        },
    });
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <Head :title="trans('brand_settings.heading.brand', {})" />

        <Heading
            variant="small"
            :title="trans('brand_settings.heading.brand', {})"
            :description="trans('brand_settings.description.brand', {})"
        />

        <div class="grid gap-4 sm:grid-cols-2">
            <BrandAssetUploader
                v-for="asset in assets"
                :key="asset.value"
                :asset="asset"
            />
        </div>

        <form novalidate @submit.prevent="submit">
            <FieldGroup>
                <Field :data-invalid="Boolean(form.errors.color_preset)">
                    <FieldLabel>{{
                        trans('brand_settings.label.color_preset', {})
                    }}</FieldLabel>
                    <div
                        class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                    >
                        <label
                            v-for="preset in colorPresets"
                            :key="preset.value"
                            class="has-checked:border-primary has-checked:ring-primary/20 flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-shadow has-checked:ring-2"
                        >
                            <input
                                v-model="form.color_preset"
                                class="sr-only"
                                type="radio"
                                name="color_preset"
                                :value="preset.value"
                                @blur="form.validate('color_preset')"
                            />
                            <span
                                class="size-6 rounded-full border shadow-sm"
                                :style="{ backgroundColor: preset.preview }"
                            />
                            <span class="text-sm font-medium">{{
                                preset.label
                            }}</span>
                        </label>
                    </div>
                    <InputError :message="form.errors.color_preset" />
                </Field>

                <div class="flex items-center gap-4">
                    <Button :disabled="form.processing || !form.isDirty">
                        {{ trans('common.button.save') }}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    </div>
</template>

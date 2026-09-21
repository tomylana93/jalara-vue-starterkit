<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { update } from '@/actions/App/Http/Controllers/Settings/GeneralSettingsController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { useTrans } from '@/composables/useTrans';
import { edit } from '@/routes/settings/general';
import type { GeneralSettingsForm } from '@/types';

const props = defineProps<{
    settings: GeneralSettingsForm;
    locales: string[];
    timezones: string[];
}>();

const { trans } = useTrans();
defineOptions({
    layout: {
        breadcrumbKeys: [
            {
                titleKey: 'general_settings.heading.settings',
                href: edit(),
            },
        ],
    },
});

const form = useForm<GeneralSettingsForm>({
    ...props.settings,
}).withPrecognition(update());

const submit = () => {
    form.submit(update(), {
        preserveScroll: true,
        onSuccess: () => form.defaults(),
    });
};
</script>

<template>
    <div class="flex flex-col gap-6">
        <Head :title="trans('general_settings.heading.general')" />

        <Heading
            variant="small"
            :title="trans('general_settings.heading.general')"
            :description="trans('general_settings.description.general')"
        />

        <form novalidate @submit.prevent="submit">
            <FieldGroup>
                <Field :data-invalid="Boolean(form.errors.application_name)">
                    <FieldLabel for="application_name">
                        {{ trans('general_settings.label.application_name') }}
                    </FieldLabel>
                    <Input
                        id="application_name"
                        v-model="form.application_name"
                        name="application_name"
                        autocomplete="organization"
                        :aria-invalid="Boolean(form.errors.application_name)"
                        @blur="form.validate('application_name')"
                    />
                    <InputError :message="form.errors.application_name" />
                </Field>

                <Field
                    :data-invalid="Boolean(form.errors.application_description)"
                >
                    <FieldLabel for="application_description">
                        {{
                            trans(
                                'general_settings.label.application_description',
                            )
                        }}
                    </FieldLabel>
                    <Textarea
                        id="application_description"
                        v-model="form.application_description"
                        name="application_description"
                        :aria-invalid="
                            Boolean(form.errors.application_description)
                        "
                        @blur="form.validate('application_description')"
                    />
                    <InputError
                        :message="form.errors.application_description"
                    />
                </Field>

                <Field :data-invalid="Boolean(form.errors.contact_email)">
                    <FieldLabel for="contact_email">
                        {{ trans('general_settings.label.contact_email') }}
                    </FieldLabel>
                    <Input
                        id="contact_email"
                        v-model="form.contact_email"
                        name="contact_email"
                        type="email"
                        autocomplete="email"
                        :aria-invalid="Boolean(form.errors.contact_email)"
                        @blur="form.validate('contact_email')"
                    />
                    <InputError :message="form.errors.contact_email" />
                </Field>

                <Field :data-invalid="Boolean(form.errors.default_locale)">
                    <FieldLabel for="default_locale">
                        {{ trans('general_settings.label.default_locale') }}
                    </FieldLabel>
                    <NativeSelect
                        id="default_locale"
                        v-model="form.default_locale"
                        name="default_locale"
                        :aria-invalid="Boolean(form.errors.default_locale)"
                        @blur="form.validate('default_locale')"
                    >
                        <NativeSelectOption
                            v-for="locale in locales"
                            :key="locale"
                            :value="locale"
                        >
                            {{ locale.toUpperCase() }}
                        </NativeSelectOption>
                    </NativeSelect>
                    <InputError :message="form.errors.default_locale" />
                </Field>

                <Field :data-invalid="Boolean(form.errors.timezone)">
                    <FieldLabel for="timezone">
                        {{ trans('general_settings.label.timezone') }}
                    </FieldLabel>
                    <NativeSelect
                        id="timezone"
                        v-model="form.timezone"
                        name="timezone"
                        :aria-invalid="Boolean(form.errors.timezone)"
                        @blur="form.validate('timezone')"
                    >
                        <NativeSelectOption
                            v-for="timezone in timezones"
                            :key="timezone"
                            :value="timezone"
                        >
                            {{ timezone }}
                        </NativeSelectOption>
                    </NativeSelect>
                    <InputError :message="form.errors.timezone" />
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

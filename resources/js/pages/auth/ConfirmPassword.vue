<script setup lang="ts">
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/actions/Laravel/Fortify/Http/Controllers/ConfirmablePasswordController';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import PasskeyVerify from '@/components/PasskeyVerify.vue';

import type { ConfirmPasswordForm } from '@/types';

const { trans } = useTrans();
defineOptions({
    layout: {
        titleKey: 'authentication.label.confirm_password',
        descriptionKey: 'authentication.description.confirm_password',
    },
});
const form = useForm<ConfirmPasswordForm>({ password: '' });

const submit = () => {
    form.submit(store(), {
        onSuccess: () => form.reset(),
    });
};
</script>

<template>
    <Head :title="trans('authentication.label.confirm_password')" />

    <PasskeyVerify
        :routes="{
            options: confirmOptions(),
            submit: confirmStore(),
        }"
        :label="trans('authentication.button.confirm_passkey')"
        :loading-label="trans('authentication.label.confirming')"
        :separator="trans('authentication.description.confirm_alternative')"
    />

    <form novalidate @submit.prevent="submit">
        <FieldGroup>
            <div class="flex flex-col gap-6">
                <Field
                    class="grid gap-2"
                    :data-invalid="Boolean(form.errors.password)"
                >
                    <FieldLabel for="password">
                        {{ trans('authentication.label.password') }}
                    </FieldLabel>
                    <PasswordInput
                        id="password"
                        name="password"
                        v-model="form.password"
                        :aria-invalid="Boolean(form.errors.password)"
                        :aria-describedby="
                            form.errors.password
                                ? 'confirm-password-password-error'
                                : undefined
                        "
                        class="mt-1 block w-full"
                        autocomplete="current-password"
                        autofocus
                    />

                    <InputError
                        id="confirm-password-password-error"
                        :message="form.errors.password"
                    />
                </Field>

                <div class="flex items-center">
                    <Button
                        class="w-full"
                        :disabled="form.processing"
                        data-test="confirm-password-button"
                    >
                        <Spinner v-if="form.processing" />
                        {{ trans('authentication.label.confirm_password') }}
                    </Button>
                </div>
            </div>
        </FieldGroup>
    </form>
</template>

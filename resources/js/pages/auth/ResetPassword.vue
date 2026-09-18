<script setup lang="ts">
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/actions/Laravel/Fortify/Http/Controllers/NewPasswordController';

import type { ResetPasswordForm } from '@/types';

const { trans } = useTrans();
defineOptions({
    layout: {
        titleKey: 'authentication.heading.reset_password',
        descriptionKey: 'authentication.description.reset_password',
    },
});

const props = defineProps<{
    token: string;
    email: string;
    passwordRules: string;
}>();

const form = useForm<ResetPasswordForm>({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.submit(store(), {
        onSuccess: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>
    <Head :title="trans('authentication.heading.reset_password')" />

    <form novalidate @submit.prevent="submit">
        <FieldGroup>
            <div class="flex flex-col gap-6">
                <Field
                    class="grid gap-2"
                    :data-invalid="Boolean(form.errors.email)"
                >
                    <FieldLabel for="email">
                        {{ trans('authentication.label.email') }}
                    </FieldLabel>
                    <Input
                        id="email"
                        type="text"
                        inputmode="email"
                        name="email"
                        v-model="form.email"
                        :aria-invalid="Boolean(form.errors.email)"
                        :aria-describedby="
                            form.errors.email
                                ? 'reset-password-email-error'
                                : undefined
                        "
                        autocomplete="email"
                        class="mt-1 block w-full"
                        readonly
                    />
                    <InputError
                        id="reset-password-email-error"
                        :message="form.errors.email"
                        class="mt-2"
                    />
                </Field>

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
                                ? 'reset-password-password-error'
                                : undefined
                        "
                        autocomplete="new-password"
                        class="mt-1 block w-full"
                        autofocus
                        :placeholder="trans('authentication.label.password')"
                        :passwordrules="passwordRules"
                    />
                    <InputError
                        id="reset-password-password-error"
                        :message="form.errors.password"
                    />
                </Field>

                <Field
                    class="grid gap-2"
                    :data-invalid="Boolean(form.errors.password_confirmation)"
                >
                    <FieldLabel for="password_confirmation">
                        {{ trans('authentication.label.confirm_password') }}
                    </FieldLabel>
                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        v-model="form.password_confirmation"
                        :aria-invalid="
                            Boolean(form.errors.password_confirmation)
                        "
                        :aria-describedby="
                            form.errors.password_confirmation
                                ? 'reset-password-password-confirmation-error'
                                : undefined
                        "
                        autocomplete="new-password"
                        class="mt-1 block w-full"
                        :placeholder="
                            trans('authentication.label.confirm_password')
                        "
                        :passwordrules="passwordRules"
                    />
                    <InputError
                        id="reset-password-password-confirmation-error"
                        :message="form.errors.password_confirmation"
                    />
                </Field>

                <Button
                    type="submit"
                    class="mt-4 w-full"
                    :disabled="form.processing"
                    data-test="reset-password-button"
                >
                    <Spinner v-if="form.processing" />
                    {{ trans('authentication.heading.reset_password') }}
                </Button>
            </div>
        </FieldGroup>
    </form>
</template>

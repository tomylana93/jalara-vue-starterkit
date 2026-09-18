<script setup lang="ts">
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/actions/Laravel/Fortify/Http/Controllers/RegisteredUserController';

import type { RegisterForm } from '@/types';

const { trans } = useTrans();
defineProps<{
    passwordRules: string;
}>();

defineOptions({
    layout: {
        titleKey: 'authentication.heading.register',
        descriptionKey: 'authentication.description.register',
    },
});
const form = useForm<RegisterForm>({
    name: '',
    email: '',
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
    <Head :title="trans('authentication.button.register')" />

    <form novalidate @submit.prevent="submit" class="flex flex-col gap-6">
        <FieldGroup>
            <div class="flex flex-col gap-6">
                <Field
                    class="grid gap-2"
                    :data-invalid="Boolean(form.errors.name)"
                >
                    <FieldLabel for="name">
                        {{ trans('authentication.label.name') }}
                    </FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        autofocus
                        :tabindex="1"
                        autocomplete="name"
                        name="name"
                        v-model="form.name"
                        :aria-invalid="Boolean(form.errors.name)"
                        :aria-describedby="
                            form.errors.name ? 'register-name-error' : undefined
                        "
                        :placeholder="
                            trans('authentication.placeholder.full_name')
                        "
                    />
                    <InputError
                        id="register-name-error"
                        :message="form.errors.name"
                    />
                </Field>

                <Field
                    class="grid gap-2"
                    :data-invalid="Boolean(form.errors.email)"
                >
                    <FieldLabel for="email">
                        {{ trans('authentication.label.email_address') }}
                    </FieldLabel>
                    <Input
                        id="email"
                        type="text"
                        inputmode="email"
                        :tabindex="2"
                        autocomplete="email"
                        name="email"
                        v-model="form.email"
                        :aria-invalid="Boolean(form.errors.email)"
                        :aria-describedby="
                            form.errors.email
                                ? 'register-email-error'
                                : undefined
                        "
                        placeholder="email@example.com"
                    />
                    <InputError
                        id="register-email-error"
                        :message="form.errors.email"
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
                        :tabindex="3"
                        autocomplete="new-password"
                        name="password"
                        v-model="form.password"
                        :aria-invalid="Boolean(form.errors.password)"
                        :aria-describedby="
                            form.errors.password
                                ? 'register-password-error'
                                : undefined
                        "
                        :placeholder="trans('authentication.label.password')"
                        :passwordrules="passwordRules"
                    />
                    <InputError
                        id="register-password-error"
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
                        :tabindex="4"
                        autocomplete="new-password"
                        name="password_confirmation"
                        v-model="form.password_confirmation"
                        :aria-invalid="
                            Boolean(form.errors.password_confirmation)
                        "
                        :aria-describedby="
                            form.errors.password_confirmation
                                ? 'register-password-confirmation-error'
                                : undefined
                        "
                        :placeholder="
                            trans('authentication.label.confirm_password')
                        "
                        :passwordrules="passwordRules"
                    />
                    <InputError
                        id="register-password-confirmation-error"
                        :message="form.errors.password_confirmation"
                    />
                </Field>

                <Button
                    type="submit"
                    class="mt-2 w-full"
                    tabindex="5"
                    :disabled="form.processing"
                    data-test="register-user-button"
                >
                    <Spinner v-if="form.processing" />
                    {{ trans('authentication.button.create_account') }}
                </Button>
            </div>

            <div class="text-muted-foreground text-center text-sm">
                {{ trans('authentication.description.has_account') }}
                <TextLink
                    :href="login()"
                    class="underline underline-offset-4"
                    :tabindex="6"
                >
                    {{ trans('authentication.button.login') }}
                </TextLink>
            </div>
        </FieldGroup>
    </form>
</template>

<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

    <form @submit.prevent="submit">
        <div class="grid gap-6">
            <div class="grid gap-2">
                <Label for="email">
                    {{ trans('authentication.label.email') }}
                </Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    v-model="form.email"
                    autocomplete="email"
                    class="mt-1 block w-full"
                    readonly
                />
                <InputError :message="form.errors.email" class="mt-2" />
            </div>

            <div class="grid gap-2">
                <Label for="password">
                    {{ trans('authentication.label.password') }}
                </Label>
                <PasswordInput
                    id="password"
                    name="password"
                    v-model="form.password"
                    autocomplete="new-password"
                    class="mt-1 block w-full"
                    autofocus
                    :placeholder="trans('authentication.label.password')"
                    :passwordrules="passwordRules"
                />
                <InputError :message="form.errors.password" />
            </div>

            <div class="grid gap-2">
                <Label for="password_confirmation">
                    {{ trans('authentication.label.confirm_password') }}
                </Label>
                <PasswordInput
                    id="password_confirmation"
                    name="password_confirmation"
                    v-model="form.password_confirmation"
                    autocomplete="new-password"
                    class="mt-1 block w-full"
                    :placeholder="
                        trans('authentication.label.confirm_password')
                    "
                    :passwordrules="passwordRules"
                />
                <InputError :message="form.errors.password_confirmation" />
            </div>

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
    </form>
</template>

<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

    <form @submit.prevent="submit" class="flex flex-col gap-6">
        <div class="grid gap-6">
            <div class="grid gap-2">
                <Label for="name">
                    {{ trans('authentication.label.name') }}
                </Label>
                <Input
                    id="name"
                    type="text"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="name"
                    name="name"
                    v-model="form.name"
                    :placeholder="trans('authentication.placeholder.full_name')"
                />
                <InputError :message="form.errors.name" />
            </div>

            <div class="grid gap-2">
                <Label for="email">
                    {{ trans('authentication.label.email_address') }}
                </Label>
                <Input
                    id="email"
                    type="email"
                    required
                    :tabindex="2"
                    autocomplete="email"
                    name="email"
                    v-model="form.email"
                    placeholder="email@example.com"
                />
                <InputError :message="form.errors.email" />
            </div>

            <div class="grid gap-2">
                <Label for="password">
                    {{ trans('authentication.label.password') }}
                </Label>
                <PasswordInput
                    id="password"
                    required
                    :tabindex="3"
                    autocomplete="new-password"
                    name="password"
                    v-model="form.password"
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
                    required
                    :tabindex="4"
                    autocomplete="new-password"
                    name="password_confirmation"
                    v-model="form.password_confirmation"
                    :placeholder="
                        trans('authentication.label.confirm_password')
                    "
                    :passwordrules="passwordRules"
                />
                <InputError :message="form.errors.password_confirmation" />
            </div>

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
    </form>
</template>

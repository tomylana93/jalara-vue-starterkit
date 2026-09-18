<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/actions/Laravel/Fortify/Http/Controllers/AuthenticatedSessionController';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/PasskeyVerify.vue';

import type { LoginForm } from '@/types';

const { trans } = useTrans();
defineOptions({
    layout: {
        titleKey: 'authentication.heading.login',
        descriptionKey: 'authentication.description.login',
    },
});

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();
const form = useForm<LoginForm>({ email: '', password: '', remember: false });

const submit = () => {
    form.submit(store(), {
        onSuccess: () => form.reset('password'),
    });
};
</script>

<template>
    <Head :title="trans('authentication.button.login')" />

    <div
        v-if="status"
        class="mb-4 text-center text-sm font-medium text-green-600"
    >
        {{ status }}
    </div>

    <PasskeyVerify />

    <form @submit.prevent="submit" class="flex flex-col gap-6">
        <div class="grid gap-6">
            <div class="grid gap-2">
                <Label for="email">
                    {{ trans('authentication.label.email_address') }}
                </Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    v-model="form.email"
                    required
                    autofocus
                    :tabindex="1"
                    autocomplete="email"
                    placeholder="email@example.com"
                />
                <InputError :message="form.errors.email" />
            </div>

            <div class="grid gap-2">
                <div class="flex items-center justify-between">
                    <Label for="password">
                        {{ trans('authentication.label.password') }}
                    </Label>
                    <TextLink
                        v-if="canResetPassword"
                        :href="request()"
                        class="text-sm"
                        :tabindex="5"
                    >
                        {{ trans('authentication.link.forgot_password') }}
                    </TextLink>
                </div>
                <PasswordInput
                    id="password"
                    name="password"
                    v-model="form.password"
                    required
                    :tabindex="2"
                    autocomplete="current-password"
                    :placeholder="trans('authentication.label.password')"
                />
                <InputError :message="form.errors.password" />
            </div>

            <div class="flex items-center justify-between">
                <Label for="remember" class="flex items-center space-x-3">
                    <Checkbox
                        id="remember"
                        name="remember"
                        v-model="form.remember"
                        :tabindex="3"
                    />
                    <span> {{ trans('authentication.label.remember') }} </span>
                </Label>
            </div>

            <Button
                type="submit"
                class="mt-4 w-full"
                :tabindex="4"
                :disabled="form.processing"
                data-test="login-button"
            >
                <Spinner v-if="form.processing" />
                {{ trans('authentication.button.login') }}
            </Button>
        </div>

        <div class="text-muted-foreground text-center text-sm">
            {{ trans('authentication.description.no_account') }}
            <TextLink :href="register()" :tabindex="5">
                {{ trans('authentication.link.signup') }}
            </TextLink>
        </div>
    </form>
</template>

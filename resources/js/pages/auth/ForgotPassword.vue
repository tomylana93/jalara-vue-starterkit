<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/actions/Laravel/Fortify/Http/Controllers/PasswordResetLinkController';

import type { ForgotPasswordForm } from '@/types';

const { trans } = useTrans();
defineOptions({
    layout: {
        titleKey: 'authentication.heading.forgot_password',
        descriptionKey: 'authentication.description.forgot_password',
    },
});

defineProps<{
    status?: string;
}>();
const form = useForm<ForgotPasswordForm>({ email: '' });

const submit = () => {
    form.submit(store());
};
</script>

<template>
    <Head :title="trans('authentication.heading.forgot_password')" />

    <div
        v-if="status"
        class="mb-4 text-center text-sm font-medium text-green-600"
    >
        {{ status }}
    </div>

    <div class="space-y-6">
        <form @submit.prevent="submit">
            <div class="grid gap-2">
                <Label for="email">
                    {{ trans('authentication.label.email_address') }}
                </Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    v-model="form.email"
                    autocomplete="off"
                    autofocus
                    placeholder="email@example.com"
                />
                <InputError :message="form.errors.email" />
            </div>

            <div class="my-6 flex items-center justify-start">
                <Button
                    class="w-full"
                    :disabled="form.processing"
                    data-test="email-password-reset-link-button"
                >
                    <Spinner v-if="form.processing" />
                    {{ trans('authentication.button.email_reset_link') }}
                </Button>
            </div>
        </form>

        <div class="text-muted-foreground space-x-1 text-center text-sm">
            <span> {{ trans('authentication.link.return_login') }} </span>
            <TextLink :href="login()">
                {{ trans('authentication.button.login') }}
            </TextLink>
        </div>
    </div>
</template>

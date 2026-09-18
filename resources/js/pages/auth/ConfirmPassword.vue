<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { Form, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import PasskeyVerify from '@/components/PasskeyVerify.vue';

const { trans } = useTrans();
defineOptions({
    layout: {
        titleKey: 'authentication.label.confirm_password',
        descriptionKey: 'authentication.description.confirm_password',
    },
});
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

    <Form
        v-bind="store.form()"
        reset-on-success
        v-slot="{ errors, processing }"
    >
        <div class="space-y-6">
            <div class="grid gap-2">
                <Label htmlFor="password">
                    {{ trans('authentication.label.password') }}
                </Label>
                <PasswordInput
                    id="password"
                    name="password"
                    class="mt-1 block w-full"
                    required
                    autocomplete="current-password"
                    autofocus
                />

                <InputError :message="errors.password" />
            </div>

            <div class="flex items-center">
                <Button
                    class="w-full"
                    :disabled="processing"
                    data-test="confirm-password-button"
                >
                    <Spinner v-if="processing" />
                    {{ trans('authentication.label.confirm_password') }}
                </Button>
            </div>
        </div>
    </Form>
</template>

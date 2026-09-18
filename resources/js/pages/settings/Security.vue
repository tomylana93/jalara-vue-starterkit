<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import { update } from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/security';
import type { Props as ManagePasskeysProps } from '@/components/ManagePasskeys.vue';
import ManagePasskeys from '@/components/ManagePasskeys.vue';
import type { Props as ManageTwoFactorProps } from '@/components/ManageTwoFactor.vue';
import ManageTwoFactor from '@/components/ManageTwoFactor.vue';

import type { UpdatePasswordForm } from '@/types';

const { trans } = useTrans();
// oxfmt-ignore
type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

const props = defineProps<Props>();

defineOptions({
    layout: {
        breadcrumbKeys: [
            {
                titleKey: 'security.heading.settings',
                href: edit(),
            },
        ],
    },
});
const form = useForm<UpdatePasswordForm>({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.submit(update(), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => form.reset(),
    });
};
</script>

<template>
    <Head :title="trans('security.heading.settings')" />

    <h1 class="sr-only">{{ trans('security.heading.settings') }}</h1>

    <div class="space-y-6">
        <Heading
            variant="small"
            :title="trans('security.heading.update_password')"
            :description="trans('security.description.update_password')"
        />

        <form @submit.prevent="submit" class="space-y-6">
            <div class="grid gap-2">
                <Label for="current_password">
                    {{ trans('security.label.current_password') }}
                </Label>
                <PasswordInput
                    id="current_password"
                    name="current_password"
                    v-model="form.current_password"
                    class="mt-1 block w-full"
                    autocomplete="current-password"
                    :placeholder="trans('security.label.current_password')"
                />
                <InputError :message="form.errors.current_password" />
            </div>

            <div class="grid gap-2">
                <Label for="password">
                    {{ trans('security.label.new_password') }}
                </Label>
                <PasswordInput
                    id="password"
                    name="password"
                    v-model="form.password"
                    class="mt-1 block w-full"
                    autocomplete="new-password"
                    :placeholder="trans('security.label.new_password')"
                    :passwordrules="props.passwordRules"
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
                    class="mt-1 block w-full"
                    autocomplete="new-password"
                    :placeholder="
                        trans('authentication.label.confirm_password')
                    "
                    :passwordrules="props.passwordRules"
                />
                <InputError :message="form.errors.password_confirmation" />
            </div>

            <div class="flex items-center gap-4">
                <Button
                    :disabled="form.processing"
                    data-test="update-password-button"
                >
                    {{ trans('common.button.save') }}
                </Button>
            </div>
        </form>
    </div>

    <ManageTwoFactor
        :canManageTwoFactor="canManageTwoFactor"
        :requiresConfirmation="requiresConfirmation"
        :twoFactorEnabled="twoFactorEnabled"
    />

    <ManagePasskeys
        :canManagePasskeys="canManagePasskeys"
        :passkeys="passkeys"
    />
</template>

<script setup lang="ts">
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import { update } from '@/actions/App/Http/Controllers/Account/SecurityController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
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

    <div class="flex flex-col gap-6">
        <Heading
            variant="small"
            :title="trans('security.heading.update_password')"
            :description="trans('security.description.update_password')"
        />

        <form novalidate @submit.prevent="submit" class="flex flex-col gap-6">
            <FieldGroup>
                <Field
                    class="grid gap-2"
                    :data-invalid="Boolean(form.errors.current_password)"
                >
                    <FieldLabel for="current_password">
                        {{ trans('security.label.current_password') }}
                    </FieldLabel>
                    <PasswordInput
                        id="current_password"
                        name="current_password"
                        v-model="form.current_password"
                        :aria-invalid="Boolean(form.errors.current_password)"
                        :aria-describedby="
                            form.errors.current_password
                                ? 'security-current-password-error'
                                : undefined
                        "
                        class="mt-1 block w-full"
                        autocomplete="current-password"
                        :placeholder="trans('security.label.current_password')"
                    />
                    <InputError
                        id="security-current-password-error"
                        :message="form.errors.current_password"
                    />
                </Field>

                <Field
                    class="grid gap-2"
                    :data-invalid="Boolean(form.errors.password)"
                >
                    <FieldLabel for="password">
                        {{ trans('security.label.new_password') }}
                    </FieldLabel>
                    <PasswordInput
                        id="password"
                        name="password"
                        v-model="form.password"
                        :aria-invalid="Boolean(form.errors.password)"
                        :aria-describedby="
                            form.errors.password
                                ? 'security-password-error'
                                : undefined
                        "
                        class="mt-1 block w-full"
                        autocomplete="new-password"
                        :placeholder="trans('security.label.new_password')"
                        :passwordrules="props.passwordRules"
                    />
                    <InputError
                        id="security-password-error"
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
                                ? 'security-password-confirmation-error'
                                : undefined
                        "
                        class="mt-1 block w-full"
                        autocomplete="new-password"
                        :placeholder="
                            trans('authentication.label.confirm_password')
                        "
                        :passwordrules="props.passwordRules"
                    />
                    <InputError
                        id="security-password-confirmation-error"
                        :message="form.errors.password_confirmation"
                    />
                </Field>

                <div class="flex items-center gap-4">
                    <Button
                        :disabled="form.processing"
                        data-test="update-password-button"
                    >
                        {{ trans('common.button.save') }}
                    </Button>
                </div>
            </FieldGroup>
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

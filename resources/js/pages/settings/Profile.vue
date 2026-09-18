<script setup lang="ts">
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useTrans } from '@/composables/useTrans';

import { useForm, Head, usePage } from '@inertiajs/vue3';
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import { update } from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/DeleteUser.vue';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

import type { ProfileForm } from '@/types';

const { trans } = useTrans();
defineOptions({
    layout: {
        breadcrumbKeys: [
            {
                titleKey: 'profile.heading.settings',
                href: edit(),
            },
        ],
    },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
const form = useForm<ProfileForm>({
    name: user.value.name,
    email: user.value.email,
}).withPrecognition(update());

const submit = () => {
    form.submit(update());
};
</script>

<template>
    <Head :title="trans('profile.heading.settings')" />

    <h1 class="sr-only">{{ trans('profile.heading.settings') }}</h1>

    <div class="flex flex-col space-y-6">
        <Heading
            variant="small"
            :title="trans('navigation.label.profile')"
            :description="trans('profile.description.settings')"
        />

        <form novalidate @submit.prevent="submit" class="flex flex-col gap-6">
            <FieldGroup>
                <Field
                    class="grid gap-2"
                    :data-invalid="Boolean(form.errors.name)"
                >
                    <FieldLabel for="name">
                        {{ trans('authentication.label.name') }}
                    </FieldLabel>
                    <Input
                        id="name"
                        class="mt-1 block w-full"
                        name="name"
                        v-model="form.name"
                        @blur="form.validate('name')"
                        :aria-invalid="Boolean(form.errors.name)"
                        :aria-describedby="
                            form.errors.name ? 'profile-name-error' : undefined
                        "
                        autocomplete="name"
                        :placeholder="
                            trans('authentication.placeholder.full_name')
                        "
                    />
                    <InputError
                        id="profile-name-error"
                        class="mt-2"
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
                        class="mt-1 block w-full"
                        name="email"
                        v-model="form.email"
                        @blur="form.validate('email')"
                        :aria-invalid="Boolean(form.errors.email)"
                        :aria-describedby="
                            form.errors.email
                                ? 'profile-email-error'
                                : undefined
                        "
                        autocomplete="username"
                        :placeholder="
                            trans('authentication.label.email_address')
                        "
                    />
                    <InputError
                        id="profile-email-error"
                        class="mt-2"
                        :message="form.errors.email"
                    />
                </Field>

                <div
                    v-if="page.props.mustVerifyEmail && !user.email_verified_at"
                >
                    <p class="text-muted-foreground -mt-4 text-sm">
                        {{ trans('profile.message.email_unverified') }}
                        <Link
                            :href="send()"
                            as="button"
                            class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                        >
                            {{ trans('profile.link.resend_verification') }}
                        </Link>
                    </p>

                    <div
                        v-if="page.props.status === 'verification-link-sent'"
                        class="mt-2 text-sm font-medium text-green-600"
                    >
                        {{ trans('profile.message.verification_sent') }}
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <Button
                        :disabled="form.processing"
                        data-test="update-profile-button"
                    >
                        {{ trans('common.button.save') }}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    </div>

    <DeleteUser />
</template>

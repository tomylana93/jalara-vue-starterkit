<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { useForm, Head } from '@inertiajs/vue3';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { store } from '@/actions/Laravel/Fortify/Http/Controllers/EmailVerificationNotificationController';

import type { EmptyForm } from '@/types';

const { trans } = useTrans();
defineOptions({
    layout: {
        titleKey: 'authentication.heading.verify_email',
        descriptionKey: 'authentication.description.verify_email',
    },
});

defineProps<{
    status?: string;
}>();
const form = useForm<EmptyForm>({});

const submit = () => {
    form.submit(store());
};
</script>

<template>
    <Head :title="trans('authentication.heading.verify_email')" />

    <div
        v-if="status === 'verification-link-sent'"
        class="mb-4 text-center text-sm font-medium text-green-600"
    >
        {{ trans('authentication.message.verification_sent') }}
    </div>

    <form novalidate @submit.prevent="submit" class="space-y-6 text-center">
        <Button :disabled="form.processing" variant="secondary">
            <Spinner v-if="form.processing" />
            {{ trans('authentication.button.resend_verification') }}
        </Button>

        <TextLink :href="logout()" as="button" class="mx-auto block text-sm">
            {{ trans('navigation.button.logout') }}
        </TextLink>
    </form>
</template>

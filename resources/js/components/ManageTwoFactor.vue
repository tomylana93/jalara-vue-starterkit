<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { useForm } from '@inertiajs/vue3';
import { ShieldCheck } from '@lucide/vue';
import { onUnmounted, ref } from 'vue';
import Heading from '@/components/Heading.vue';
import TwoFactorRecoveryCodes from '@/components/TwoFactorRecoveryCodes.vue';
import TwoFactorSetupModal from '@/components/TwoFactorSetupModal.vue';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';
import {
    store as enable,
    destroy as disable,
} from '@/actions/Laravel/Fortify/Http/Controllers/TwoFactorAuthenticationController';
import type { EmptyForm } from '@/types';

const { trans } = useTrans();
export type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

withDefaults(defineProps<Props>(), {
    canManageTwoFactor: false,
    requiresConfirmation: false,
    twoFactorEnabled: false,
});

const { hasSetupData, clearTwoFactorAuthData } = useTwoFactorAuth();
const showSetupModal = ref<boolean>(false);

onUnmounted(() => clearTwoFactorAuthData());
const enableForm = useForm<EmptyForm>({});
const disableForm = useForm<EmptyForm>({});

const enableTwoFactor = () => {
    enableForm.submit(enable(), {
        onSuccess: () => {
            showSetupModal.value = true;
        },
    });
};

const disableTwoFactor = () => {
    disableForm.submit(disable());
};
</script>

<template>
    <div v-if="canManageTwoFactor" class="space-y-6">
        <Heading
            variant="small"
            :title="trans('security.heading.two_factor')"
            :description="trans('security.description.two_factor')"
        />

        <div
            v-if="!twoFactorEnabled"
            class="flex flex-col items-start justify-start space-y-4"
        >
            <p class="text-muted-foreground text-sm">
                {{ trans('security.description.two_factor_disabled') }}
            </p>

            <div>
                <Button v-if="hasSetupData" @click="showSetupModal = true">
                    <ShieldCheck />
                    {{ trans('security.button.continue_setup') }}
                </Button>
                <form v-else @submit.prevent="enableTwoFactor">
                    <Button type="submit" :disabled="enableForm.processing">
                        {{ trans('security.button.enable_two_factor') }}
                    </Button>
                </form>
            </div>
        </div>

        <div v-else class="flex flex-col items-start justify-start space-y-4">
            <p class="text-muted-foreground text-sm">
                {{ trans('security.description.two_factor_enabled') }}
            </p>

            <div class="relative inline">
                <form @submit.prevent="disableTwoFactor">
                    <Button
                        variant="destructive"
                        type="submit"
                        :disabled="disableForm.processing"
                    >
                        {{ trans('security.button.disable_two_factor') }}
                    </Button>
                </form>
            </div>

            <TwoFactorRecoveryCodes />
        </div>

        <TwoFactorSetupModal
            v-model:isOpen="showSetupModal"
            :requiresConfirmation="requiresConfirmation"
            :twoFactorEnabled="twoFactorEnabled"
        />
    </div>
</template>

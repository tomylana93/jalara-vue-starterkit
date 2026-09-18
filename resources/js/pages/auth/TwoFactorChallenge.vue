<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { useForm, Head, setLayoutProps } from '@inertiajs/vue3';
import { computed, ref, watchEffect } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { store } from '@/actions/Laravel/Fortify/Http/Controllers/TwoFactorAuthenticatedSessionController';
import type {
    TwoFactorConfigContent,
    TwoFactorChallengeForm,
    TwoFactorRecoveryForm,
} from '@/types';

const { trans } = useTrans();
defineOptions({
    layout: {
        titleKey: 'authentication.heading.authentication_code',
        descriptionKey: 'authentication.description.authentication_code',
    },
});
const showRecoveryInput = ref<boolean>(false);
const codeForm = useForm<TwoFactorChallengeForm>({ code: '' });
const recoveryForm = useForm<TwoFactorRecoveryForm>({ recovery_code: '' });

const submitCode = () => {
    codeForm.submit(store(), {
        onError: () => codeForm.reset(),
    });
};

const submitRecoveryCode = () => {
    recoveryForm.submit(store(), {
        onError: () => recoveryForm.reset(),
    });
};

const authConfigContent = computed<TwoFactorConfigContent>(() => {
    if (showRecoveryInput.value) {
        return {
            title: trans('authentication.heading.recovery_code'),
            description: trans('authentication.description.recovery_code'),
            buttonText: trans('authentication.link.use_authentication_code'),
        };
    }

    return {
        title: trans('authentication.heading.authentication_code'),
        description: trans('authentication.description.authentication_code'),
        buttonText: trans('authentication.link.use_recovery_code'),
    };
});

watchEffect(() => {
    setLayoutProps({
        title: authConfigContent.value.title,
        description: authConfigContent.value.description,
    });
});

const toggleRecoveryMode = (): void => {
    showRecoveryInput.value = !showRecoveryInput.value;
    codeForm.resetAndClearErrors();
    recoveryForm.resetAndClearErrors();
};
</script>

<template>
    <Head :title="trans('security.heading.two_factor')" />

    <div class="space-y-6">
        <template v-if="!showRecoveryInput">
            <form @submit.prevent="submitCode" class="space-y-4">
                <div
                    class="flex flex-col items-center justify-center space-y-3 text-center"
                >
                    <div class="flex w-full items-center justify-center">
                        <InputOTP
                            id="otp"
                            v-model="codeForm.code"
                            :maxlength="6"
                            :disabled="codeForm.processing"
                            autofocus
                        >
                            <InputOTPGroup>
                                <InputOTPSlot
                                    v-for="index in 6"
                                    :key="index"
                                    :index="index - 1"
                                />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <InputError :message="codeForm.errors.code" />
                </div>
                <Button
                    type="submit"
                    class="w-full"
                    :disabled="codeForm.processing"
                >
                    {{ trans('common.button.continue') }}
                </Button>
                <div class="text-muted-foreground text-center text-sm">
                    <span>
                        {{ trans('authentication.description.alternative') }}
                    </span>
                    <button
                        type="button"
                        class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                        @click="toggleRecoveryMode"
                    >
                        {{ authConfigContent.buttonText }}
                    </button>
                </div>
            </form>
        </template>

        <template v-else>
            <form @submit.prevent="submitRecoveryCode" class="space-y-4">
                <Input
                    name="recovery_code"
                    v-model="recoveryForm.recovery_code"
                    type="text"
                    :placeholder="
                        trans('authentication.placeholder.recovery_code')
                    "
                    :autofocus="showRecoveryInput"
                    required
                />
                <InputError :message="recoveryForm.errors.recovery_code" />
                <Button
                    type="submit"
                    class="w-full"
                    :disabled="recoveryForm.processing"
                >
                    {{ trans('common.button.continue') }}
                </Button>

                <div class="text-muted-foreground text-center text-sm">
                    <span>
                        {{ trans('authentication.description.alternative') }}
                    </span>
                    <button
                        type="button"
                        class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                        @click="toggleRecoveryMode"
                    >
                        {{ authConfigContent.buttonText }}
                    </button>
                </div>
            </form>
        </template>
    </div>
</template>

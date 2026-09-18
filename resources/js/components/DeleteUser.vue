<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { useForm } from '@inertiajs/vue3';
import { useTemplateRef } from 'vue';
import { destroy } from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import type { DeleteUserForm } from '@/types';

const { trans } = useTrans();
const passwordInput = useTemplateRef('passwordInput');
const form = useForm<DeleteUserForm>({ password: '' });

const submit = () => {
    form.submit(destroy(), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => passwordInput.value?.focus(),
    });
};
</script>

<template>
    <div class="space-y-6">
        <Heading
            variant="small"
            :title="trans('profile.heading.delete_account')"
            :description="trans('profile.description.delete_account')"
        />
        <div
            class="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10"
        >
            <div class="relative space-y-0.5 text-red-600 dark:text-red-100">
                <p class="font-medium">{{ trans('profile.label.warning') }}</p>
                <p class="text-sm">
                    {{ trans('profile.description.warning') }}
                </p>
            </div>
            <Dialog>
                <DialogTrigger as-child>
                    <Button
                        variant="destructive"
                        data-test="delete-user-button"
                    >
                        {{ trans('profile.heading.delete_account') }}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <form @submit.prevent="submit" class="space-y-6">
                        <DialogHeader class="space-y-3">
                            <DialogTitle>
                                {{
                                    trans('profile.heading.delete_confirmation')
                                }}
                            </DialogTitle>
                            <DialogDescription>
                                {{
                                    trans(
                                        'profile.description.delete_confirmation',
                                    )
                                }}
                            </DialogDescription>
                        </DialogHeader>

                        <div class="grid gap-2">
                            <Label for="password" class="sr-only">
                                {{ trans('authentication.label.password') }}
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                v-model="form.password"
                                ref="passwordInput"
                                :placeholder="
                                    trans('authentication.label.password')
                                "
                            />
                            <InputError :message="form.errors.password" />
                        </div>

                        <DialogFooter class="gap-2">
                            <DialogClose as-child>
                                <Button
                                    variant="secondary"
                                    @click="
                                        () => {
                                            form.clearErrors();
                                            form.reset();
                                        }
                                    "
                                >
                                    {{ trans('common.button.cancel') }}
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                variant="destructive"
                                :disabled="form.processing"
                                data-test="confirm-delete-user-button"
                            >
                                {{ trans('profile.heading.delete_account') }}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>

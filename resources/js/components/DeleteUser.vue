<script setup lang="ts">
import { useTrans } from '@/composables/useTrans';

import { Form } from '@inertiajs/vue3';
import { useTemplateRef } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
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

const { trans } = useTrans();
const passwordInput = useTemplateRef('passwordInput');
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
                    <Form
                        v-bind="ProfileController.destroy.form()"
                        reset-on-success
                        @error="() => passwordInput?.focus()"
                        :options="{
                            preserveScroll: true,
                        }"
                        class="space-y-6"
                        v-slot="{ errors, processing, reset, clearErrors }"
                    >
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
                                ref="passwordInput"
                                :placeholder="
                                    trans('authentication.label.password')
                                "
                            />
                            <InputError :message="errors.password" />
                        </div>

                        <DialogFooter class="gap-2">
                            <DialogClose as-child>
                                <Button
                                    variant="secondary"
                                    @click="
                                        () => {
                                            clearErrors();
                                            reset();
                                        }
                                    "
                                >
                                    {{ trans('common.button.cancel') }}
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                variant="destructive"
                                :disabled="processing"
                                data-test="confirm-delete-user-button"
                            >
                                {{ trans('profile.heading.delete_account') }}
                            </Button>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>

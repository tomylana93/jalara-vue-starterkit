<script setup lang="ts">
import { router, useHttp } from '@inertiajs/vue3';
import { onBeforeUnmount, ref, watch } from 'vue';
import {
    store,
    destroy,
} from '@/actions/App/Http/Controllers/Account/AvatarController';
import FileUploader from '@/components/FileUploader.vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/composables/useInitials';
import { useTrans } from '@/composables/useTrans';
import type { UploadedFile, UploadFile } from '@/types/uploads';

const props = defineProps<{ initialFile: UploadedFile | null; name: string }>();
const { trans } = useTrans();
const { getInitials } = useInitials();
const current = ref(props.initialFile);
watch(
    () => props.initialFile,
    (file) => {
        current.value = file;
    },
);
const uploadHttp = useHttp<{ file: File | null }, { data: UploadedFile }>({
    file: null,
});
const removeHttp = useHttp<Record<string, never>, { data: null }>({});

const upload: UploadFile = async (file, onProgress) => {
    uploadHttp.file = file;
    try {
        const response = await uploadHttp.post(store.url(), {
            onProgress: (progress) => {
                if (progress.percentage !== undefined)
                    onProgress({ percentage: progress.percentage });
            },
        });
        return response.data;
    } catch {
        throw new Error(
            uploadHttp.errors.file ?? trans('uploads.error.upload'),
        );
    } finally {
        uploadHttp.reset('file');
    }
};

async function remove() {
    try {
        await removeHttp.delete(destroy.url());
    } catch {
        throw new Error(trans('uploads.error.remove'));
    }
}

function updateAvatar(file: UploadedFile | null) {
    router.replaceProp('auth.user.avatar', file?.thumbnailUrl ?? null);
    router.replaceProp('avatarMedia', file);
}

onBeforeUnmount(() => {
    uploadHttp.cancel();
    removeHttp.cancel();
});
</script>

<template>
    <FileUploader
        v-model="current"
        :label="trans('profile.label.avatar')"
        accept="image/jpeg,image/png,image/webp"
        :max-size-bytes="2 * 1024 * 1024"
        :upload="upload"
        :remove="remove"
        @uploaded="updateAvatar"
        @removed="updateAvatar(null)"
    >
        <template #preview="{ url }">
            <img
                v-if="url"
                :src="url"
                :alt="name"
                class="size-20 shrink-0 rounded-full object-cover"
            />
            <Avatar v-else class="size-20 shrink-0">
                <AvatarFallback>{{ getInitials(name) }}</AvatarFallback>
            </Avatar>
        </template>
    </FileUploader>
</template>

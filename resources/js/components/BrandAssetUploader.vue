<script setup lang="ts">
import { router, useHttp } from '@inertiajs/vue3';
import { onBeforeUnmount, ref, watch } from 'vue';
import {
    destroy,
    store,
} from '@/actions/App/Http/Controllers/Settings/BrandAssetController';
import FileUploader from '@/components/FileUploader.vue';
import { useTrans } from '@/composables/useTrans';
import type { BrandAssetOption } from '@/types';
import type { UploadedFile, UploadFile } from '@/types/uploads';

const props = defineProps<{ asset: BrandAssetOption }>();
const { trans } = useTrans();
const current = ref(props.asset.file);

watch(
    () => props.asset.file,
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
        const response = await uploadHttp.post(store.url(props.asset.value), {
            onProgress: (progress) => {
                if (progress.percentage !== undefined) {
                    onProgress({ percentage: progress.percentage });
                }
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
        await removeHttp.delete(destroy.url(props.asset.value));
    } catch {
        throw new Error(trans('uploads.error.remove'));
    }
}

function refreshBrand() {
    router.reload();
}

onBeforeUnmount(() => {
    uploadHttp.cancel();
    removeHttp.cancel();
});
</script>

<template>
    <div class="rounded-lg border p-4">
        <FileUploader
            v-model="current"
            :label="asset.label"
            :accept="asset.accept"
            :max-size-bytes="asset.maxSizeBytes"
            :upload="upload"
            :remove="remove"
            @uploaded="refreshBrand"
            @removed="refreshBrand"
        />
    </div>
</template>

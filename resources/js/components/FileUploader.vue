<script setup lang="ts">
import { FileIcon, UploadIcon, Trash2Icon } from '@lucide/vue';
import { computed, onBeforeUnmount, ref, shallowRef, useId } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { useTrans } from '@/composables/useTrans';
import { acceptsFile, formatFileSize } from '@/lib/uploads';
import { cn } from '@/lib/utils';
import type { UploadedFile, UploadFile } from '@/types/uploads';

const props = withDefaults(
    defineProps<{
        label: string;
        accept?: string;
        maxSizeBytes?: number;
        upload: UploadFile;
        remove?: () => Promise<void>;
        disabled?: boolean;
    }>(),
    { accept: '', disabled: false },
);

const model = defineModel<UploadedFile | null>({ default: null });
const emit = defineEmits<{
    uploaded: [file: UploadedFile];
    removed: [];
}>();
const { trans } = useTrans();
const id = useId();
const selected = shallowRef<File | null>(null);
const preview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const dragDepth = ref(0);
const operation = ref<'upload' | 'remove' | null>(null);
const percentage = ref<number | null>(null);
const error = ref('');
const status = ref('');
const busy = computed(() => operation.value !== null);
const locked = computed(() => props.disabled || busy.value);
const previewUrl = computed(() =>
    selected.value ? preview.value : model.value?.thumbnailUrl,
);
const fileName = computed(() => selected.value?.name ?? model.value?.name);
const fileSize = computed(() => selected.value?.size ?? model.value?.sizeBytes);

function releasePreview() {
    if (preview.value) {
        URL.revokeObjectURL(preview.value);
        preview.value = null;
    }
}

function clearSelection() {
    releasePreview();
    selected.value = null;
    if (fileInput.value) fileInput.value.value = '';
}

function selectFile(file?: File) {
    if (locked.value) return;
    if (!file) return;
    clearSelection();
    error.value = '';
    status.value = '';
    if (!acceptsFile(file, props.accept)) {
        error.value = trans('uploads.error.type');
        return;
    }
    if (props.maxSizeBytes !== undefined && file.size > props.maxSizeBytes) {
        error.value = trans('uploads.error.size', {
            size: formatFileSize(props.maxSizeBytes),
        });
        return;
    }
    selected.value = file;
    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
        preview.value = URL.createObjectURL(file);
    }
}

function selectFromInput(event: Event) {
    selectFile((event.target as HTMLInputElement).files?.[0]);
}

function enterDropzone(event: DragEvent) {
    if (!locked.value && event.dataTransfer?.types.includes('Files'))
        dragDepth.value++;
}

function leaveDropzone() {
    dragDepth.value = Math.max(0, dragDepth.value - 1);
}

function dropFile(event: DragEvent) {
    dragDepth.value = 0;
    if (locked.value) return;
    const files = event.dataTransfer?.files;
    if (!files?.length) return;
    if (files.length > 1) {
        error.value = trans('uploads.error.single');
        return;
    }
    selectFile(files[0]);
}

async function uploadSelected() {
    if (!selected.value || locked.value) return;
    operation.value = 'upload';
    error.value = '';
    status.value = '';
    percentage.value = null;
    try {
        const file = await props.upload(selected.value, (progress) => {
            percentage.value = Math.min(100, Math.max(0, progress.percentage));
        });
        model.value = file;
        clearSelection();
        status.value = trans('uploads.status.uploaded');
        emit('uploaded', file);
    } catch (failure) {
        error.value =
            failure instanceof Error
                ? failure.message
                : trans('uploads.error.upload');
    } finally {
        operation.value = null;
        percentage.value = null;
    }
}

async function removeStored() {
    if (!model.value || !props.remove || locked.value) return;
    operation.value = 'remove';
    error.value = '';
    status.value = '';
    try {
        await props.remove();
        model.value = null;
        clearSelection();
        status.value = trans('uploads.status.removed');
        emit('removed');
    } catch (failure) {
        error.value =
            failure instanceof Error
                ? failure.message
                : trans('uploads.error.remove');
    } finally {
        operation.value = null;
    }
}

onBeforeUnmount(releasePreview);
</script>

<template>
    <FieldGroup>
        <Field
            :data-invalid="Boolean(error)"
            :data-disabled="locked"
            :aria-busy="busy"
        >
            <FieldLabel :for="id">{{ label }}</FieldLabel>
            <div
                data-slot="upload-dropzone"
                :data-dragging="dragDepth > 0 && !locked"
                :class="
                    cn(
                        'border-input bg-background flex min-h-48 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-6 transition-colors',
                        dragDepth > 0 && !locked && 'border-primary bg-accent',
                        locked && 'opacity-50',
                    )
                "
                @dragenter.prevent="enterDropzone"
                @dragover.prevent
                @dragleave.prevent="leaveDropzone"
                @drop.prevent="dropFile"
            >
                <slot name="preview" :url="previewUrl" :file-name="fileName">
                    <img
                        v-if="previewUrl"
                        :src="previewUrl"
                        :alt="fileName ?? label"
                        class="size-20 rounded-md object-cover"
                    />
                    <FileIcon
                        v-else
                        class="text-muted-foreground size-10 shrink-0"
                        aria-hidden="true"
                    />
                </slot>
                <div
                    v-if="fileName"
                    class="flex max-w-full min-w-0 flex-col items-center gap-1"
                >
                    <p class="truncate text-sm" :title="fileName">
                        {{ fileName }}
                    </p>
                    <p
                        v-if="fileSize !== undefined"
                        class="text-muted-foreground text-sm"
                    >
                        {{ formatFileSize(fileSize) }}
                    </p>
                    <p v-if="selected" class="text-muted-foreground text-xs">
                        {{ trans('uploads.status.selected') }}
                    </p>
                </div>
                <p v-else class="text-muted-foreground text-center text-sm">
                    {{ trans('uploads.description.drop') }}
                </p>
                <Button
                    type="button"
                    variant="outline"
                    :disabled="locked"
                    :aria-controls="id"
                    @click="fileInput?.click()"
                >
                    {{ trans('uploads.button.choose') }}
                </Button>
            </div>
            <input
                :id="id"
                ref="fileInput"
                class="sr-only"
                type="file"
                :accept="accept || undefined"
                :disabled="locked"
                :aria-invalid="Boolean(error)"
                :aria-describedby="error ? `${id}-error` : undefined"
                @change="selectFromInput"
            />
            <div class="flex flex-wrap items-center gap-2">
                <Button
                    type="button"
                    :disabled="!selected || locked"
                    @click="uploadSelected"
                >
                    <Spinner
                        v-if="operation === 'upload'"
                        data-icon="inline-start"
                    />
                    <UploadIcon v-else data-icon="inline-start" />
                    {{ trans('uploads.button.upload') }}
                </Button>
                <Button
                    v-if="selected"
                    type="button"
                    variant="outline"
                    :disabled="locked"
                    @click="clearSelection"
                >
                    {{ trans('uploads.button.discard') }}
                </Button>
                <Button
                    v-if="model && remove"
                    type="button"
                    variant="outline"
                    :disabled="locked"
                    @click="removeStored"
                >
                    <Spinner
                        v-if="operation === 'remove'"
                        data-icon="inline-start"
                    />
                    <Trash2Icon v-else data-icon="inline-start" />
                    {{ trans('uploads.button.remove') }}
                </Button>
            </div>
            <div
                v-if="operation === 'upload'"
                class="flex flex-col gap-2"
                role="status"
                aria-live="polite"
            >
                <Progress
                    :model-value="percentage"
                    :aria-label="trans('uploads.status.uploading')"
                />
                <p class="text-muted-foreground text-sm">
                    {{
                        percentage === 100
                            ? trans('uploads.status.processing')
                            : trans('uploads.status.uploading')
                    }}
                    <span v-if="percentage !== null && percentage < 100"
                        >{{ percentage }}%</span
                    >
                </p>
            </div>
            <InputError :id="`${id}-error`" :message="error" role="alert" />
            <p
                v-if="status"
                class="text-muted-foreground text-sm"
                role="status"
                aria-live="polite"
            >
                {{ status }}
            </p>
        </Field>
    </FieldGroup>
</template>

<script lang="ts" setup>
import type { UploadFile, UploadProps } from 'antdv-next';

import { ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { message, Upload } from 'antdv-next';

import { uploadImageUrl } from '#/api/image-bed';

const props = withDefaults(
  defineProps<{
    accept?: string;
    disabled?: boolean;
    maxSize?: number;
  }>(),
  {
    accept: 'image/*',
    maxSize: 5,
  },
);

const value = defineModel<string>('value', { default: '' });

const fileList = ref<UploadFile[]>([]);

function urlToUploadFile(url: string): UploadFile {
  return {
    name: 'cover',
    status: 'done',
    uid: 'cover',
    url,
  };
}

function syncFileListFromValue(url?: string) {
  fileList.value = url ? [urlToUploadFile(url)] : [];
}

watch(
  () => value.value,
  (url) => {
    syncFileListFromValue(url);
  },
  { immediate: true },
);

const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!file || typeof file.size !== 'number') {
    return false;
  }
  if (props.maxSize && file.size / 1024 / 1024 > props.maxSize) {
    message.error($t('ui.formRules.sizeLimit', [props.maxSize]));
    return Upload.LIST_IGNORE;
  }
  return true;
};

const customRequest: UploadProps['customRequest'] = async (options) => {
  const { file, onError, onProgress, onSuccess } = options;
  const origin = file as File;
  try {
    onProgress?.({ percent: 0 });
    const url = await uploadImageUrl({
      file: origin,
      onProgress: (percent) => onProgress?.({ percent }),
    });
    onProgress?.({ percent: 100 });
    value.value = url;
    onSuccess?.({ url });
    message.success('封面上传成功');
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
};

const handleChange: UploadProps['onChange'] = (info) => {
  if (info.fileList.length === 0) {
    value.value = '';
    fileList.value = [];
  }
};
</script>

<template>
  <Upload
    v-model:file-list="fileList"
    :accept="accept"
    :before-upload="handleBeforeUpload"
    :custom-request="customRequest"
    :disabled="disabled"
    :max-count="1"
    list-type="picture-card"
    @change="handleChange"
  >
    <div
      v-if="fileList.length === 0"
      class="flex flex-col items-center justify-center text-foreground/60"
    >
      <IconifyIcon class="mb-1 size-6" icon="ant-design:plus-outlined" />
      <span class="text-xs">上传封面</span>
    </div>
  </Upload>
</template>

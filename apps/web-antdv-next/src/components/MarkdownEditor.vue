<script lang="ts" setup>
import type { ExposeParam, UploadImgCallBack } from 'md-editor-v3';

import { ref } from 'vue';

import { Button, message, Space } from 'antdv-next';
import { MdEditor } from 'md-editor-v3';

import { uploadImageUrl } from '#/api/image-bed';

import ImagePickerModal from './ImagePickerModal.vue';

import 'md-editor-v3/lib/style.css';

withDefaults(
  defineProps<{
    height?: number;
    placeholder?: string;
  }>(),
  {
    placeholder: '支持 Markdown 语法',
    height: 420,
  },
);

const modelValue = defineModel<string>({ default: '' });

const editorRef = ref<ExposeParam>();
const pickerOpen = ref(false);

async function onUploadImg(files: File[], callback: UploadImgCallBack) {
  try {
    const urls = await Promise.all(
      files.map((file) => uploadImageUrl({ file })),
    );
    callback(urls);
  } catch (error) {
    console.error('Markdown image upload failed:', error);
    message.error('图片上传失败，请稍后重试');
  }
}

function insertMarkdownImages(urls: string[]) {
  for (const url of urls) {
    editorRef.value?.insert(() => ({
      targetValue: `\n![image](${url})\n`,
      deviationEnd: 0,
      deviationStart: 0,
      select: false,
    }));
  }
}

function onPickerConfirm(urls: string[]) {
  if (urls.length === 0) {
    return;
  }
  insertMarkdownImages(urls);
  message.success(`已插入 ${urls.length} 张图片`);
}
</script>

<template>
  <div>
    <Space class="mb-2">
      <Button size="small" type="default" @click="pickerOpen = true">
        插入图片（图库 / 上传）
      </Button>
      <span class="text-xs text-foreground/50">
        也可拖拽、粘贴图片直接上传
      </span>
    </Space>

    <MdEditor
      ref="editorRef"
      v-model="modelValue"
      :placeholder="placeholder"
      :style="{ height: `${height}px` }"
      code-theme="atom"
      language="zh-CN"
      preview-theme="default"
      @on-upload-img="onUploadImg"
    />

    <ImagePickerModal
      v-model:open="pickerOpen"
      multiple
      title="插入图片"
      @confirm="onPickerConfirm"
    />
  </div>
</template>

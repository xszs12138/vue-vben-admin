<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3';

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
</script>

<template>
  <MdEditor
    v-model="modelValue"
    :placeholder="placeholder"
    :style="{ height: `${height}px` }"
    language="zh-CN"
    preview-theme="default"
    code-theme="atom"
  />
</template>

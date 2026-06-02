<script setup lang="ts">
import { EllipsisText } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, message } from 'antdv-next';
const props = defineProps<{
  text?: string;
}>();

function copy() {
  if (props.text) {
    navigator.clipboard.writeText(props.text);
    message.success(`复制成功,已粘贴到剪贴板`);
  }
}
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <EllipsisText :line="2" :tooltip-when-ellipsis="true">
      {{ text }}
    </EllipsisText>
    <Button type="link" @click="copy">
      <IconifyIcon icon="ant-design:copy-outlined" class="size-5" />
    </Button>
  </div>
</template>

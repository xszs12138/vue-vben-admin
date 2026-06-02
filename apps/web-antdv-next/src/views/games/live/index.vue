<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Spin } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { getLiveApi, updateLiveApi } from '#/api/core/live';

import { toLivePayload, useLiveFormSchema } from './data';

const loading = ref(true);
const saving = ref(false);

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useLiveFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

async function loadLive() {
  loading.value = true;
  try {
    const data = await getLiveApi();
    formApi.setValues({
      isLive: data.isLive,
      platform: data.platform || 'bilibili',
      roomTitle: data.roomTitle,
      streamTitle: data.streamTitle,
      subtitle: data.subtitle,
      cover: data.cover,
      streamUrl: data.streamUrl,
    });
  } finally {
    loading.value = false;
  }
}

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }

  saving.value = true;
  try {
    const values = await formApi.getValues();
    await updateLiveApi(toLivePayload(values));
    message.success('直播配置已保存');
    await loadLive();
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadLive();
});
</script>

<template>
  <Page auto-content-height title="直播管理">
    <Card class="max-w-3xl">
      <Spin :spinning="loading">
        <p class="mb-4 text-sm text-neutral-500">
          配置博客游戏页右侧 LIVE 区块。关闭「开播状态」时，前台不展示该模块。
        </p>
        <Form />
        <div class="mt-6 flex justify-end gap-2">
          <Button :disabled="loading" @click="loadLive"> 重置 </Button>
          <Button :loading="saving" type="primary" @click="onSubmit">
            保存
          </Button>
        </div>
      </Spin>
    </Card>
  </Page>
</template>

<script lang="ts" setup>
import type { MusicApi } from '#/api/core/music';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  createMusicTrackApi,
  getMusicTrackApi,
  updateMusicTrackApi,
} from '#/api/core/music';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const trackId = ref<number>();
const getTitle = computed(() => (trackId.value ? '编辑曲目' : '新建曲目'));

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    modalApi.lock();
    try {
      const values = await formApi.getValues<MusicApi.SaveParams>();
      const payload: MusicApi.SaveParams = {
        ...values,
        artist: values.artist ?? '',
        coverUrl: values.coverUrl ?? '',
        durationSeconds: values.durationSeconds ?? 0,
        lrc: values.lrc ?? '',
        sort: values.sort ?? 100,
        visible: values.visible ?? true,
      };

      if (trackId.value) {
        await updateMusicTrackApi(trackId.value, payload);
        message.success('曲目已更新');
      } else {
        await createMusicTrackApi(payload);
        message.success('曲目已创建');
      }

      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      trackId.value = undefined;
      formApi.resetForm();
      return;
    }

    const data = modalApi.getData<{ id?: number }>();
    if (data?.id) {
      trackId.value = data.id;
      modalApi.lock(true);
      try {
        const detail = await getMusicTrackApi(data.id);
        formApi.setValues({
          name: detail.name,
          artist: detail.artist,
          audioUrl: detail.audioUrl,
          coverUrl: detail.coverUrl,
          lrc: detail.lrc,
          durationSeconds: detail.durationSeconds,
          sort: detail.sort,
          visible: detail.visible,
        });
      } finally {
        modalApi.lock(false);
      }
      return;
    }

    formApi.setValues({
      durationSeconds: 0,
      sort: 100,
      visible: true,
    });
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[560px]">
    <Form class="mx-4" />
  </Modal>
</template>

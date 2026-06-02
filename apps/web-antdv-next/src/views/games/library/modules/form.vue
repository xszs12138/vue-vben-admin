<script lang="ts" setup>
import type { GamesApi } from '#/api/core/games';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { getGameApi, updateGameApi } from '#/api/core/games';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const gameId = ref<number>();
const gameName = ref('');

const getTitle = computed(() =>
  gameName.value ? `编辑游戏 · ${gameName.value}` : '编辑游戏',
);

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (!gameId.value) {
      return;
    }

    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    modalApi.lock();
    try {
      const values = await formApi.getValues<{
        genres?: string[];
        isVisible?: boolean;
        nameZh?: string;
        playStatus?: GamesApi.PlayStatus;
        progressPercent?: null | number;
        sort?: number;
      }>();

      const payload: GamesApi.UpdateParams = {
        nameZh: values.nameZh?.trim() || undefined,
        genres: values.genres ?? [],
        playStatus: values.playStatus,
        isVisible: values.isVisible ?? false,
        sort: values.sort ?? 100,
        progressPercent:
          values.progressPercent === null ||
          values.progressPercent === undefined ||
          Number.isNaN(values.progressPercent)
            ? null
            : values.progressPercent,
      };

      await updateGameApi(gameId.value, payload);
      message.success('游戏已更新');
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      gameId.value = undefined;
      gameName.value = '';
      formApi.resetForm();
      return;
    }

    const data = modalApi.getData<{ id?: number }>();
    if (!data?.id) {
      return;
    }

    gameId.value = data.id;
    modalApi.lock(true);
    try {
      const detail = await getGameApi(data.id);
      gameName.value = detail.nameZh || detail.name;
      formApi.setValues({
        nameZh: detail.nameZh,
        genres: Array.isArray(detail.genres) ? detail.genres : [],
        playStatus: detail.playStatus,
        progressPercent: detail.progressPercent ?? undefined,
        sort: detail.sort,
        isVisible: detail.isVisible,
      });
    } finally {
      modalApi.lock(false);
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[520px]">
    <Form class="mx-4" />
  </Modal>
</template>

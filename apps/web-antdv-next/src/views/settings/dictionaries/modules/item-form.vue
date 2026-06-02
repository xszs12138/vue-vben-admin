<script lang="ts" setup>
import type { DictionariesApi } from '#/api/core/dictionaries';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  createDictionaryItemApi,
  updateDictionaryItemApi,
} from '#/api/core/dictionaries';

import { useItemFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const itemId = ref<number>();
const dictType = ref('');
const getTitle = computed(() => (itemId.value ? '编辑键值' : '添加键值'));

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useItemFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid || !dictType.value) {
      return;
    }

    modalApi.lock();
    try {
      const values =
        await formApi.getValues<Omit<DictionariesApi.SaveParams, 'dictType'>>();
      const payload: DictionariesApi.SaveParams = {
        dictType: dictType.value,
        value: Number(values.value),
        code: String(values.code).trim(),
        label: String(values.label).trim(),
        enabled: values.enabled ?? true,
        sort: values.sort ?? 100,
      };

      if (itemId.value) {
        await updateDictionaryItemApi(itemId.value, payload);
        message.success('键值已更新');
      } else {
        await createDictionaryItemApi(dictType.value, payload);
        message.success('键值已添加');
      }

      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      itemId.value = undefined;
      dictType.value = '';
      formApi.resetForm();
      return;
    }

    const data = modalApi.getData<{
      dictType: string;
      row?: DictionariesApi.DictItem;
    }>();
    dictType.value = data?.dictType ?? '';

    if (data?.row) {
      itemId.value = data.row.id;
      formApi.setValues({
        label: data.row.label,
        code: data.row.code,
        value: data.row.value,
        sort: data.row.sort,
        enabled: data.row.enabled,
      });
      return;
    }

    formApi.setValues({
      enabled: true,
      sort: 100,
    });
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[480px]">
    <Form class="mx-4" />
  </Modal>
</template>

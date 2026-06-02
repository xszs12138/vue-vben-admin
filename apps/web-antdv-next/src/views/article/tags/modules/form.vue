<script lang="ts" setup>
import type { TagsApi } from '#/api/core/tags';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { createTagApi, getTagApi, updateTagApi } from '#/api/core/tags';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const tagId = ref<number>();
const getTitle = computed(() => (tagId.value ? '编辑标签' : '新建标签'));

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
      const values = await formApi.getValues<TagsApi.SaveParams>();
      const payload: TagsApi.SaveParams = {
        ...values,
        sort: values.sort ?? 100,
        visible: values.visible ?? true,
      };

      if (tagId.value) {
        await updateTagApi(tagId.value, payload);
        message.success('标签已更新');
      } else {
        await createTagApi(payload);
        message.success('标签已创建');
      }

      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      tagId.value = undefined;
      formApi.resetForm();
      return;
    }

    const data = modalApi.getData<{ id?: number }>();
    if (data?.id) {
      tagId.value = data.id;
      modalApi.lock(true);
      try {
        const detail = await getTagApi(data.id);
        formApi.setValues({
          name: detail.name,
          slug: detail.slug,
          description: detail.description,
          sort: detail.sort,
          visible: detail.visible,
        });
      } finally {
        modalApi.lock(false);
      }
      return;
    }

    formApi.setValues({
      sort: 100,
      visible: true,
    });
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[520px]">
    <Form class="mx-4" />
  </Modal>
</template>

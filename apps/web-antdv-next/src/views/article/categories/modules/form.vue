<script lang="ts" setup>
import type { CategoriesApi } from '#/api/core/categories';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  createCategoryApi,
  getCategoryApi,
  updateCategoryApi,
} from '#/api/core/categories';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const categoryId = ref<number>();
const getTitle = computed(() => (categoryId.value ? '编辑分类' : '新建分类'));

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
      const values = await formApi.getValues<CategoriesApi.SaveParams>();
      const payload: CategoriesApi.SaveParams = {
        ...values,
        sort: values.sort ?? 100,
        visible: values.visible ?? true,
      };

      if (categoryId.value) {
        await updateCategoryApi(categoryId.value, payload);
        message.success('分类已更新');
      } else {
        await createCategoryApi(payload);
        message.success('分类已创建');
      }

      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      categoryId.value = undefined;
      formApi.resetForm();
      return;
    }

    const data = modalApi.getData<{ id?: number }>();
    if (data?.id) {
      categoryId.value = data.id;
      modalApi.lock(true);
      try {
        const detail = await getCategoryApi(data.id);
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

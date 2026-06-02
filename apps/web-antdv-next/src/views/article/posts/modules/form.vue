<script lang="ts" setup>
import type { PostsApi } from '#/api/core/posts';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { createPostApi, getPostApi, updatePostApi } from '#/api/core/posts';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const postId = ref<number>();
const getTitle = computed(() => (postId.value ? '编辑文章' : '新建文章'));

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
      const values = await formApi.getValues<PostsApi.SaveParams>();
      const payload: PostsApi.SaveParams = {
        ...values,
        categoryId: values.categoryId ?? null,
        contentType: 'html',
        status: values.status || 'draft',
        tagIds: values.tagIds ?? [],
      };

      if (postId.value) {
        await updatePostApi(postId.value, payload);
        message.success('文章已更新');
      } else {
        await createPostApi(payload);
        message.success('文章已创建');
      }

      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      postId.value = undefined;
      formApi.resetForm();
      return;
    }

    const data = modalApi.getData<{ id?: number }>();
    if (data?.id) {
      postId.value = data.id;
      modalApi.lock(true);
      try {
        const detail = await getPostApi(data.id);
        formApi.setValues({
          title: detail.title,
          slug: detail.slug,
          cover: detail.cover,
          summary: detail.summary,
          categoryId: detail.categoryId,
          tagIds: detail.tagIds ?? [],
          content: detail.content,
          status: detail.status,
          isPinned: detail.isPinned,
        });
      } finally {
        modalApi.lock(false);
      }
      return;
    }

    formApi.setValues({
      isPinned: false,
      status: 'draft',
      tagIds: [],
    });
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[900px]">
    <Form class="mx-4" />
  </Modal>
</template>

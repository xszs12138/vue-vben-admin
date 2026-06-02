<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { replyCommentApi } from '#/api/core/comments';

import { useReplySchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const commentId = ref<number>();
const nickname = ref('');

const getTitle = computed(() =>
  nickname.value ? `回复「${nickname.value}」` : '回复评论',
);

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useReplySchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid || !commentId.value) {
      return;
    }

    modalApi.lock();
    try {
      const values = await formApi.getValues<{ content: string }>();
      await replyCommentApi(commentId.value, {
        content: values.content.trim(),
      });
      message.success('回复已发布');
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  onOpenChange(isOpen) {
    if (!isOpen) {
      commentId.value = undefined;
      nickname.value = '';
      formApi.resetForm();
      return;
    }

    const data = modalApi.getData<{ id: number; nickname: string }>();
    commentId.value = data?.id;
    nickname.value = data?.nickname ?? '';
    formApi.resetForm();
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[520px]">
    <Form class="mx-4" />
  </Modal>
</template>

<script lang="ts" setup>
import type { DictionariesApi } from '#/api/core/dictionaries';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Alert, message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { updateDictionaryTypeApi } from '#/api/core/dictionaries';

import { useTypeFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const dictKey = ref('');
const isEdit = ref(false);

const getTitle = computed(() => (isEdit.value ? '编辑字典' : '添加字典'));

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useTypeFormSchema(false),
  showDefaultActions: false,
});

function applySchema(edit: boolean) {
  formApi.setState({ schema: useTypeFormSchema(edit) });
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const values = await formApi.getValues<{
      description?: string;
      enabled: boolean;
      key: string;
      name: string;
    }>();
    const key = (isEdit.value ? dictKey.value : values.key)?.trim();
    if (!key) {
      message.warning('请填写名称（字典标识）');
      return;
    }

    modalApi.lock();
    try {
      await updateDictionaryTypeApi(key, {
        name: String(values.name).trim(),
        description: values.description?.trim() ?? '',
        enabled: values.enabled ?? true,
      });
      message.success(isEdit.value ? '字典已更新' : '字典已保存');
      modalApi.close();
      emit('success');
    } catch {
      message.error(
        isEdit.value
          ? '更新失败'
          : '保存失败：请确认「名称」为已在服务端注册的字典标识（如 game-genre）',
      );
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      dictKey.value = '';
      isEdit.value = false;
      formApi.resetForm();
      applySchema(false);
      return;
    }

    const data = modalApi.getData<DictionariesApi.DictType>();
    if (data?.key) {
      isEdit.value = true;
      dictKey.value = data.key;
      applySchema(true);
      formApi.setValues({
        key: data.key,
        name: data.name,
        description: data.description,
        enabled: data.enabled,
      });
      return;
    }

    isEdit.value = false;
    applySchema(false);
    formApi.setValues({
      enabled: true,
    });
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[480px]">
    <Alert
      v-if="!isEdit"
      class="mx-4 mb-4"
      show-icon
      type="info"
      message="新字典类型需先在服务端代码中注册。此处「名称」请填写已注册的字典标识（如 operation、game-genre），用于维护展示名称与启用状态。"
    />
    <Form class="mx-4" />
  </Modal>
</template>

<script lang="ts" setup>
import type { UploadProps } from 'antdv-next';

import { ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import {
  Button,
  Empty,
  Input,
  message,
  Modal,
  Pagination,
  Space,
  Spin,
  Upload,
} from 'antdv-next';

import { uploadImageUrl } from '#/api/image-bed';
import { useImageLibrary } from '#/composables/use-image-library';

import ImageLibraryGrid from './ImageLibraryGrid.vue';

const props = withDefaults(
  defineProps<{
    maxSize?: number;
    multiple?: boolean;
    title?: string;
  }>(),
  {
    maxSize: 5,
    multiple: false,
    title: '选择图片',
  },
);

const emit = defineEmits<{
  confirm: [urls: string[]];
}>();

const open = defineModel<boolean>('open', { default: false });

const activeTab = ref<'library' | 'upload'>('library');
const selectedUrls = ref<string[]>([]);
const uploading = ref(false);

const {
  changePage,
  images,
  keyword,
  load,
  loading,
  page,
  perPage,
  search,
  total,
} = useImageLibrary();

function resetState() {
  activeTab.value = 'library';
  selectedUrls.value = [];
  keyword.value = '';
}

watch(open, (visible) => {
  if (visible) {
    resetState();
    load(1);
  }
});

function toggleSelect(url: string) {
  if (!url) {
    return;
  }
  if (props.multiple) {
    const index = selectedUrls.value.indexOf(url);
    if (index === -1) {
      selectedUrls.value.push(url);
    } else {
      selectedUrls.value.splice(index, 1);
    }
    return;
  }
  selectedUrls.value = [url];
}

function handleConfirm() {
  if (selectedUrls.value.length === 0) {
    message.warning('请选择或上传一张图片');
    return;
  }
  emit('confirm', [...selectedUrls.value]);
  open.value = false;
}

const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!file || typeof file.size !== 'number') {
    return false;
  }
  if (props.maxSize && file.size / 1024 / 1024 > props.maxSize) {
    message.error($t('ui.formRules.sizeLimit', [props.maxSize]));
    return Upload.LIST_IGNORE;
  }
  return true;
};

const customRequest: UploadProps['customRequest'] = async (options) => {
  const { file, onError, onProgress, onSuccess } = options;
  uploading.value = true;
  try {
    onProgress?.({ percent: 0 });
    const url = await uploadImageUrl({
      file: file as File,
      onProgress: (percent) => onProgress?.({ percent }),
    });
    onProgress?.({ percent: 100 });
    onSuccess?.({ url });
    if (props.multiple) {
      if (!selectedUrls.value.includes(url)) {
        selectedUrls.value.push(url);
      }
    } else {
      selectedUrls.value = [url];
      emit('confirm', [url]);
      open.value = false;
      return;
    }
    message.success('上传成功');
    activeTab.value = 'library';
    await load(page.value);
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <Modal
    v-model:open="open"
    :destroy-on-close="false"
    :title="title"
    :width="720"
    @cancel="open = false"
  >
    <Space class="mb-4">
      <Button
        :type="activeTab === 'library' ? 'primary' : 'default'"
        @click="activeTab = 'library'"
      >
        图库选择
      </Button>
      <Button
        :type="activeTab === 'upload' ? 'primary' : 'default'"
        @click="activeTab = 'upload'"
      >
        本地上传
      </Button>
    </Space>

    <template v-if="activeTab === 'library'">
      <div class="mb-3 flex items-center gap-2">
        <Input
          v-model:value="keyword"
          allow-clear
          class="flex-1"
          placeholder="搜索文件名"
          @press-enter="search"
        />
        <Button :loading="loading" type="primary" @click="search">
          搜索
        </Button>
      </div>

      <Spin :spinning="loading">
        <ImageLibraryGrid
          v-if="images.length > 0"
          :images="images"
          :multiple="multiple"
          :selected-urls="selectedUrls"
          @select="toggleSelect"
        />
        <Empty v-else class="py-8" description="暂无图片" />
      </Spin>

      <div v-if="total > 0" class="mt-4 flex justify-center">
        <Pagination
          :current="page"
          :page-size="perPage"
          :show-size-changer="false"
          :total="total"
          @change="changePage"
        />
      </div>
    </template>

    <Upload
      v-else
      :before-upload="handleBeforeUpload"
      :custom-request="customRequest"
      :disabled="uploading"
      :multiple="multiple"
      :show-upload-list="false"
      accept="image/*"
      class="block w-full"
      drag
    >
      <div
        class="flex flex-col items-center justify-center py-10 text-foreground/60"
      >
        <IconifyIcon
          class="mb-2 size-10"
          icon="ant-design:cloud-upload-outlined"
        />
        <p class="text-sm">点击或拖拽图片到此处上传</p>
        <p class="mt-1 text-xs">上传至 7bu 图床，最大 {{ maxSize }}MB</p>
      </div>
    </Upload>

    <template #footer>
      <Button @click="open = false">取消</Button>
      <Button
        :disabled="selectedUrls.length === 0"
        type="primary"
        @click="handleConfirm"
      >
        确定{{ selectedUrls.length > 0 ? `（${selectedUrls.length}）` : '' }}
      </Button>
    </template>
  </Modal>
</template>

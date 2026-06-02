<script setup lang="ts">
import type { TableProps } from 'antdv-next';

import type { ImageBedListItem, ImageBedProfile } from '#/api/image-bed';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Image,
  message,
  Space,
  Table,
  Tag,
  Upload,
} from 'antdv-next';

import {
  deleteImageBedImage,
  getImageBedImages,
  getImageBedProfile,
  uploadImageUrl,
} from '#/api/image-bed';
import CopyButton from '#/components/CopyButton.vue';

import UserInfo from '../components/UserInfo.vue';

const route = useRoute();
const filterAlbumId = computed(() => {
  const id = route.query.albumId;
  if (id === undefined || id === '') {
    return undefined;
  }
  const num = Number(id);
  return Number.isFinite(num) ? num : undefined;
});

const loading = ref(false);
const profile = ref<ImageBedProfile>();
const images = ref<ImageBedListItem[]>([]);
const page = ref(1);

const columns: TableProps['columns'] = [
  {
    dataIndex: 'links',
    key: 'thumb',
    title: '预览',
    width: 100,
    align: 'center',
  },
  {
    dataIndex: 'origin_name',
    key: 'name',
    title: '文件名',
    ellipsis: true,
    align: 'center',
  },
  {
    dataIndex: 'links',
    key: 'links',
    title: 'URL',
    align: 'center',
    width: 200,
  },
  {
    dataIndex: 'size',
    key: 'size',
    title: '大小(KB)',
    width: 100,
    align: 'center',
  },
  {
    dataIndex: 'human_date',
    key: 'date',
    title: '上传时间',
    width: 160,
    align: 'center',
  },
  { key: 'action', title: '操作', width: 88, align: 'center', fixed: 'end' },
];

async function loadProfile() {
  const data = await getImageBedProfile();
  profile.value = data;
}

async function loadImages() {
  loading.value = true;
  try {
    const res = await getImageBedImages({
      page: page.value,
      order: 'newest',
      albumId: filterAlbumId.value,
    });
    images.value = res.data;
  } finally {
    loading.value = false;
  }
}

async function refresh() {
  await Promise.all([loadProfile(), loadImages()]);
}

async function handleUpload(file: File) {
  try {
    const url = await uploadImageUrl({ file });
    message.success('上传成功');
    await navigator.clipboard.writeText(url).catch(() => undefined);
    await refresh();
  } catch {
    // 错误提示由 imageBedClient 拦截器处理
  }
  return false;
}

async function handleDelete(key: string) {
  try {
    await deleteImageBedImage(key);
    message.success('已删除');
    await refresh();
  } catch {
    // 拦截器已提示
  }
}

watch(
  () => route.query.albumId,
  () => {
    page.value = 1;
    loadImages();
  },
);

onMounted(() => {
  refresh();
});
</script>

<template>
  <Page title="图片管理">
    <UserInfo v-if="profile" class="mb-4!" :profile="profile" />
    <Card title="图片列表">
      <template #extra>
        <Space>
          <Tag v-if="filterAlbumId" color="processing">
            相册 ID: {{ filterAlbumId }}
          </Tag>
          <Upload
            :before-upload="(f) => handleUpload(f as File)"
            :show-upload-list="false"
            accept="image/*"
          >
            <Button type="primary">上传图片</Button>
          </Upload>
          <Button @click="refresh">刷新</Button>
        </Space>
      </template>

      <Table
        :columns="columns"
        :data-source="images"
        :loading="loading"
        :pagination="false"
        bordered
        :scroll="{ x: 'max-content' }"
        row-key="key"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'thumb'">
            <Image
              :src="record.links?.thumbnail_url || record.links?.url"
              :width="56"
              class="rounded"
            />
          </template>
          <template v-else-if="column.key === 'links'">
            <CopyButton :text="record.links?.url" />
          </template>
          <template v-else-if="column.key === 'action'">
            <Button
              danger
              size="small"
              type="link"
              @click="handleDelete(record.key)"
            >
              删除
            </Button>
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>

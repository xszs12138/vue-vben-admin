<script setup lang="ts">
import type { ImageBedAlbum, ImageBedProfile } from '#/api/image-bed';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
} from 'antdv-next';

import {
  deleteImageBedAlbum,
  getImageBedAlbums,
  getImageBedProfile,
} from '#/api/image-bed';

import UserInfo from '../components/UserInfo.vue';

const router = useRouter();

const loading = ref(false);
const profile = ref<ImageBedProfile>();
const albums = ref<ImageBedAlbum[]>([]);
const page = ref(1);
const lastPage = ref(1);
const perPage = ref(10);
const total = ref(0);
const keyword = ref('');
const order = ref<'earliest' | 'least' | 'most' | 'newest'>('newest');

const orderOptions = [
  { label: '最新', value: 'newest' },
  { label: '最早', value: 'earliest' },
  { label: '图片最多', value: 'most' },
  { label: '图片最少', value: 'least' },
];

const columns = [
  { dataIndex: 'id', key: 'id', title: 'ID', width: 80 },
  { dataIndex: 'name', key: 'name', title: '相册名称', ellipsis: true },
  { dataIndex: 'intro', key: 'intro', title: '简介', ellipsis: true },
  { dataIndex: 'image_num', key: 'image_num', title: '图片数', width: 90 },
  { key: 'action', title: '操作', width: 200 },
];

async function loadProfile() {
  profile.value = await getImageBedProfile();
}

async function loadAlbums() {
  loading.value = true;
  try {
    const res = await getImageBedAlbums({
      page: page.value,
      order: order.value,
      q: keyword.value.trim() || undefined,
    });
    albums.value = res.data;
    lastPage.value = res.last_page;
    perPage.value = res.per_page;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}

async function refresh() {
  await Promise.all([loadProfile(), loadAlbums()]);
}

function handleSearch() {
  page.value = 1;
  loadAlbums();
}

function handlePageChange(next: number) {
  page.value = next;
  loadAlbums();
}

function goAlbumImages(albumId: number) {
  router.push({
    path: '/imageBed/images',
    query: { albumId: String(albumId) },
  });
}

async function handleDelete(id: number) {
  try {
    await deleteImageBedAlbum(id);
    message.success('相册已删除');
    await refresh();
  } catch {
    // 拦截器已提示
  }
}

onMounted(() => {
  refresh();
});
</script>

<template>
  <Page title="相册管理">
    <UserInfo v-if="profile" class="mb-4!" :profile="profile" />

    <Card title="相册列表">
      <template #extra>
        <Space wrap>
          <Input
            v-model:value="keyword"
            allow-clear
            class="w-48"
            placeholder="搜索相册名称"
            @press-enter="handleSearch"
          />
          <Select
            v-model:value="order"
            :options="orderOptions"
            class="w-32"
            @change="handleSearch"
          />
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button @click="refresh">刷新</Button>
        </Space>
      </template>

      <Table
        :columns="columns"
        :data-source="albums"
        :loading="loading"
        :pagination="
          lastPage > 1
            ? {
                current: page,
                pageSize: perPage,
                total,
                onChange: handlePageChange,
                showSizeChanger: false,
              }
            : false
        "
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <Space :size="4">
              <Button
                size="small"
                type="link"
                @click="goAlbumImages(record.id)"
              >
                查看图片
              </Button>
              <Popconfirm
                :title="`确定删除相册「${record.name}」吗？`"
                placement="topLeft"
                @confirm="handleDelete(record.id)"
              >
                <Button danger size="small" type="link">删除</Button>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>

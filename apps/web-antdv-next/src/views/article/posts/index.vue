<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PostsApi } from '#/api/core/posts';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Popconfirm, Space, Tag } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deletePostApi,
  getPostsApi,
  updatePostStatusApi,
} from '#/api/core/posts';

import {
  getPostStatusColor,
  getPostStatusLabel,
  useColumns,
  useSearchSchema,
} from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: useSearchSchema(),
  showCollapseButton: false,
  submitOnChange: false,
  submitOnEnter: true,
};

const gridOptions: VxeTableGridOptions<PostsApi.ListItem> = {
  columns: useColumns(),
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getPostsApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function refreshGrid() {
  gridApi.query();
}

function onCreate() {
  formModalApi.setData(null).open();
}

async function onEdit(row: PostsApi.ListItem) {
  formModalApi.setData({ id: row.id }).open();
}

async function onDelete(row: PostsApi.ListItem) {
  await deletePostApi(row.id);
  message.success(`已删除「${row.title}」`);
  refreshGrid();
}

async function onUpdateStatus(
  row: PostsApi.ListItem,
  status: PostsApi.PostStatus,
) {
  await updatePostStatusApi(row.id, status);
  message.success('状态已更新');
  refreshGrid();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <Grid table-title="文章列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新建文章
        </Button>
      </template>
      <template #category="{ row }">
        <template v-if="row.category">
          <Tag>
            {{ row.category.name }}
          </Tag>
        </template>
        <template v-else> - </template>
      </template>
      <template #status="{ row }">
        <Tag :color="getPostStatusColor(row.status)">
          {{ getPostStatusLabel(row.status) }}
        </Tag>
      </template>
      <template #tags="{ row }">
        <template v-if="row.tags.length > 0">
          <Tag v-for="tag in row.tags" :key="tag.id" class="mr-2!">
            {{ tag.name }}
          </Tag>
        </template>
        <template v-else> - </template>
      </template>
      <template #action="{ row }">
        <Space :size="4">
          <Button size="small" type="link" @click="onEdit(row)">编辑</Button>
          <Button
            v-if="row.status !== 'published'"
            size="small"
            type="link"
            @click="onUpdateStatus(row, 'published')"
          >
            发布
          </Button>
          <Button
            v-if="row.status === 'published'"
            size="small"
            type="link"
            @click="onUpdateStatus(row, 'archived')"
          >
            下架
          </Button>
          <Popconfirm
            :title="`确定删除「${row.title}」吗？`"
            placement="topLeft"
            @confirm="onDelete(row)"
          >
            <Button danger size="small" type="link">删除</Button>
          </Popconfirm>
        </Space>
      </template>
    </Grid>
  </Page>
</template>

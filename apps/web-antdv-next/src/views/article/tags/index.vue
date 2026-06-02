<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { TagsApi } from '#/api/core/tags';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Popconfirm, Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteTagApi, getTagsApi } from '#/api/core/tags';

import { useColumns, useSearchSchema } from './data';
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

const gridOptions: VxeTableGridOptions<TagsApi.ListItem> = {
  columns: useColumns(),
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getTagsApi({
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

function onEdit(row: TagsApi.ListItem) {
  formModalApi.setData({ id: row.id }).open();
}

async function onDelete(row: TagsApi.ListItem) {
  await deleteTagApi(row.id);
  message.success(`已删除「${row.name}」`);
  refreshGrid();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <Grid table-title="标签列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新建标签
        </Button>
      </template>

      <template #action="{ row }">
        <Space :size="4">
          <Button size="small" type="link" @click="onEdit(row)">编辑</Button>
          <Popconfirm
            :title="`确定删除「${row.name}」吗？关联文章的标签关联将被移除。`"
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

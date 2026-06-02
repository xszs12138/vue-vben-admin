<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CategoriesApi } from '#/api/core/categories';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Popconfirm, Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteCategoryApi, getCategoriesApi } from '#/api/core/categories';

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

const gridOptions: VxeTableGridOptions<CategoriesApi.ListItem> = {
  columns: useColumns(),
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getCategoriesApi({
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

function onEdit(row: CategoriesApi.ListItem) {
  formModalApi.setData({ id: row.id }).open();
}

async function onDelete(row: CategoriesApi.ListItem) {
  await deleteCategoryApi(row.id);
  message.success(`已删除「${row.name}」`);
  refreshGrid();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <Grid table-title="分类列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新建分类
        </Button>
      </template>

      <template #action="{ row }">
        <Space :size="4">
          <Button size="small" type="link" @click="onEdit(row)">编辑</Button>
          <Popconfirm
            :title="`确定删除「${row.name}」吗？关联文章的分类将被清空。`"
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

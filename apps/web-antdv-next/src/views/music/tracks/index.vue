<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MusicApi } from '#/api/core/music';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Popconfirm, Space } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteMusicTrackApi, getMusicTracksApi } from '#/api/core/music';

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

const gridOptions: VxeTableGridOptions<MusicApi.ListItem> = {
  columns: useColumns(),
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getMusicTracksApi({
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

function onEdit(row: MusicApi.ListItem) {
  formModalApi.setData({ id: row.id }).open();
}

async function onDelete(row: MusicApi.ListItem) {
  await deleteMusicTrackApi(row.id);
  message.success(`已删除「${row.name}」`);
  refreshGrid();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <Grid table-title="音乐曲目">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-4" />
          新建曲目
        </Button>
      </template>
      <template #action="{ row }">
        <Space>
          <Button size="small" type="link" @click="onEdit(row)"> 编辑 </Button>
          <Popconfirm
            :title="`确定删除「${row.name}」？`"
            @confirm="onDelete(row)"
          >
            <Button danger size="small" type="link"> 删除 </Button>
          </Popconfirm>
        </Space>
      </template>
    </Grid>
  </Page>
</template>

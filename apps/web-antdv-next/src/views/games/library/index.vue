<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { GamesApi } from '#/api/core/games';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, Image, message, Modal, Space, Tag } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getGamesApi, syncGamesApi } from '#/api/core/games';

import { useColumns } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const gridOptions: VxeTableGridOptions<GamesApi.ListItem> = {
  columns: useColumns(),
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getGamesApi({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    refresh: true,
    resizable: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const syncing = ref(false);

function refreshGrid() {
  gridApi.query();
}

function onEdit(row: GamesApi.ListItem) {
  formModalApi.setData({ id: row.id }).open();
}

function onSync() {
  Modal.confirm({
    title: '同步 Steam 游戏库',
    content:
      '将从 Steam 拉取游戏库、时长与成就数据。新入库游戏默认不在博客展示，需在编辑中开启「博客可见」。',
    okText: '开始同步',
    async onOk() {
      syncing.value = true;
      try {
        const result = await syncGamesApi();
        message.success(
          `同步完成：共 ${result.syncedCount} 款，博客展示 ${result.visibleCount} 款`,
        );
        refreshGrid();
      } catch (error: unknown) {
        const msg =
          error instanceof Error
            ? error.message
            : '同步失败，请检查 config/config.yaml 中的 steam 配置与 Steam 游戏详情隐私';
        message.error(msg);
      } finally {
        syncing.value = false;
      }
    },
  });
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <Grid table-title="游戏库">
      <template #toolbar-tools>
        <Button :loading="syncing" type="primary" @click="onSync">
          <IconifyIcon class="size-5" icon="mdi:sync" />
          同步 Steam
        </Button>
      </template>

      <template #cover="{ row }">
        <Image
          v-if="row.cover"
          :src="row.cover"
          :width="72"
          :height="40"
          class="rounded object-cover"
        />
        <Tag v-else color="default"> 无封面 </Tag>
      </template>

      <template #action="{ row }">
        <Space :size="4">
          <Button size="small" type="link" @click="onEdit(row)"> 编辑 </Button>
        </Space>
      </template>
    </Grid>
  </Page>
</template>

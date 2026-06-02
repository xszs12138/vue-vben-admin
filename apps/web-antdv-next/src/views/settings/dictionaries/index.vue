<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DictionariesApi } from '#/api/core/dictionaries';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon, Plus } from '@vben/icons';

import { Button, message, Space, Switch } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getDictionaryTypesApi,
  updateDictionaryTypeApi,
} from '#/api/core/dictionaries';

import { useTypeColumns } from './data';
import ItemsModal from './modules/items-modal.vue';
import TypeForm from './modules/type-form.vue';

const [TypeFormModal, typeFormApi] = useVbenModal({
  connectedComponent: TypeForm,
  destroyOnClose: true,
});

const [ItemsModalHost, itemsModalApi] = useVbenModal({
  connectedComponent: ItemsModal,
  destroyOnClose: true,
});

const gridOptions: VxeTableGridOptions<DictionariesApi.DictType> = {
  columns: useTypeColumns(),
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        const items = await getDictionaryTypesApi();
        return { items, total: items.length };
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

function refreshGrid() {
  gridApi.query();
}

function onCreateType() {
  typeFormApi.setData(undefined).open();
}

function onEditType(row: DictionariesApi.DictType) {
  typeFormApi.setData(row).open();
}

function onManageItems(row: DictionariesApi.DictType) {
  itemsModalApi.setData(row).open();
}

async function onToggleTypeEnabled(
  row: DictionariesApi.DictType,
  enabled: boolean,
) {
  try {
    await updateDictionaryTypeApi(row.key, {
      name: row.name,
      description: row.description,
      enabled,
    });
    row.enabled = enabled;
    message.success(enabled ? '字典已启用' : '字典已停用');
  } catch {
    message.error('状态更新失败');
    refreshGrid();
  }
}
</script>

<template>
  <Page auto-content-height>
    <TypeFormModal @success="refreshGrid" />
    <ItemsModalHost />

    <Grid table-title="字典管理">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreateType">
          <Plus class="size-5" />
          添加字典
        </Button>
      </template>

      <template #enabled="{ row }">
        <Switch
          :checked="row.enabled"
          @update:checked="
            (checked) => onToggleTypeEnabled(row, checked === true)
          "
        />
      </template>

      <template #action="{ row }">
        <Space :size="0">
          <Button size="small" type="link" @click="onEditType(row)">
            <IconifyIcon
              class="size-4 text-primary"
              icon="mdi:square-edit-outline"
            />
          </Button>
          <Button size="small" type="link" @click="onManageItems(row)">
            <IconifyIcon
              class="size-4 text-[#22c55e]"
              icon="mdi:format-list-bulleted"
            />
          </Button>
        </Space>
      </template>
    </Grid>
  </Page>
</template>

<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DictionariesApi } from '#/api/core/dictionaries';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon, Plus } from '@vben/icons';

import { Button, message, Popconfirm, Space, Switch } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDictionaryItemApi,
  getDictionaryItemsApi,
  updateDictionaryItemApi,
} from '#/api/core/dictionaries';

import { isSystemOperationItem, useItemColumns } from '../data';
import ItemForm from './item-form.vue';

const dictType = ref<DictionariesApi.DictType | null>(null);

const modalTitle = computed(
  () => `编辑键值${dictType.value?.name ? ` · ${dictType.value.name}` : ''}`,
);

const [ItemFormModal, itemFormApi] = useVbenModal({
  connectedComponent: ItemForm,
  destroyOnClose: true,
});

const gridOptions: VxeTableGridOptions<DictionariesApi.DictItem> = {
  columns: useItemColumns(),
  height: 420,
  keepSource: true,
  pagerConfig: {
    pageSize: 20,
    pageSizes: [10, 20, 50],
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        if (!dictType.value?.key) {
          return { items: [], total: 0 };
        }
        const items = await getDictionaryItemsApi(dictType.value.key);
        const start = (page.currentPage - 1) * page.pageSize;
        const end = start + page.pageSize;
        return {
          items: items.slice(start, end),
          total: items.length,
        };
      },
    },
  },
  toolbarConfig: {
    refresh: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[960px]',
  footer: false,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      dictType.value = null;
      return;
    }
    dictType.value = modalApi.getData<DictionariesApi.DictType>();
    await nextTick();
    gridApi.query();
  },
});

function refreshGrid() {
  gridApi.query();
}

function onCreateItem() {
  if (!dictType.value?.key) {
    return;
  }
  itemFormApi.setData({ dictType: dictType.value.key }).open();
}

function onEditItem(row: DictionariesApi.DictItem) {
  if (!dictType.value?.key) {
    return;
  }
  itemFormApi.setData({ dictType: dictType.value.key, row }).open();
}

async function onDeleteItem(row: DictionariesApi.DictItem) {
  await deleteDictionaryItemApi(row.id);
  message.success(`已删除「${row.label}」`);
  refreshGrid();
}

async function onToggleItemEnabled(
  row: DictionariesApi.DictItem,
  enabled: boolean,
) {
  if (!dictType.value?.key) {
    return;
  }
  try {
    await updateDictionaryItemApi(row.id, {
      dictType: dictType.value.key,
      value: row.value,
      code: row.code,
      label: row.label,
      sort: row.sort,
      enabled,
    });
    row.enabled = enabled;
    message.success(enabled ? '已启用' : '已停用');
  } catch {
    message.error('状态更新失败');
    refreshGrid();
  }
}
</script>

<template>
  <Modal :title="modalTitle">
    <ItemFormModal @success="refreshGrid" />

    <div class="px-1 pb-2">
      <div class="mb-3 flex justify-end">
        <Button type="primary" @click="onCreateItem">
          <Plus class="size-4" />
          添加键值
        </Button>
      </div>

      <Grid>
        <template #enabled="{ row }">
          <Switch
            :checked="row.enabled"
            :disabled="isSystemOperationItem(dictType?.key ?? '', row)"
            @update:checked="
              (checked) => onToggleItemEnabled(row, checked === true)
            "
          />
        </template>

        <template #action="{ row }">
          <Space :size="0">
            <Button size="small" type="link" @click="onEditItem(row)">
              <IconifyIcon
                class="size-4 text-primary"
                icon="mdi:square-edit-outline"
              />
            </Button>
            <Popconfirm
              v-if="!isSystemOperationItem(dictType?.key ?? '', row)"
              title="确定删除该键值吗？"
              @confirm="onDeleteItem(row)"
            >
              <Button danger size="small" type="link">
                <IconifyIcon class="size-4" icon="mdi:delete-outline" />
              </Button>
            </Popconfirm>
          </Space>
        </template>
      </Grid>
    </div>
  </Modal>
</template>

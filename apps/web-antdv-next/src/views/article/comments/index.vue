<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CommentsApi } from '#/api/core/comments';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message, Popconfirm, Space, Tag } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  approveCommentApi,
  deleteCommentApi,
  getCommentsApi,
  rejectCommentApi,
} from '#/api/core/comments';

import {
  getCommentStatusColor,
  getCommentStatusLabel,
  useColumns,
  useSearchSchema,
} from './data';
import Reply from './modules/reply.vue';

const [ReplyModal, replyModalApi] = useVbenModal({
  connectedComponent: Reply,
  destroyOnClose: true,
});

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: useSearchSchema(),
  showCollapseButton: false,
  submitOnChange: false,
  submitOnEnter: true,
};

const gridOptions: VxeTableGridOptions<CommentsApi.ListItem> = {
  columns: useColumns(),
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getCommentsApi({
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

function canApprove(status: CommentsApi.CommentStatus) {
  return status === 'pending' || status === 'rejected';
}

function canReject(status: CommentsApi.CommentStatus) {
  return status === 'pending' || status === 'approved';
}

function canReply(row: CommentsApi.ListItem) {
  return !row.parentId;
}

function onReply(row: CommentsApi.ListItem) {
  replyModalApi.setData({ id: row.id, nickname: row.nickname }).open();
}

async function onApprove(row: CommentsApi.ListItem) {
  await approveCommentApi(row.id);
  message.success('已通过');
  refreshGrid();
}

async function onReject(row: CommentsApi.ListItem) {
  await rejectCommentApi(row.id);
  message.success('已拒绝');
  refreshGrid();
}

async function onDelete(row: CommentsApi.ListItem) {
  await deleteCommentApi(row.id);
  message.success('已删除');
  refreshGrid();
}
</script>

<template>
  <Page auto-content-height>
    <ReplyModal @success="refreshGrid" />
    <Grid table-title="评论列表">
      <template #status="{ row }">
        <Tag :color="getCommentStatusColor(row.status)">
          {{ getCommentStatusLabel(row.status) }}
        </Tag>
      </template>

      <template #action="{ row }">
        <Space :size="4" wrap>
          <Button
            v-if="canApprove(row.status)"
            size="small"
            type="link"
            @click="onApprove(row)"
          >
            通过
          </Button>
          <Button
            v-if="canReject(row.status)"
            danger
            size="small"
            type="link"
            @click="onReject(row)"
          >
            拒绝
          </Button>
          <Button
            v-if="canReply(row)"
            size="small"
            type="link"
            @click="onReply(row)"
          >
            回复
          </Button>
          <Popconfirm
            title="确定删除该评论吗？"
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

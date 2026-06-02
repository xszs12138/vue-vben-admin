import type { VxeTableGridColumns } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { CommentsApi } from '#/api/core/comments';

import { z } from '#/adapter/form';
import { getPostsApi } from '#/api/core/posts';

export const commentStatusOptions = [
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
  { label: '垃圾', value: 'spam' },
] as const;

export function getCommentStatusLabel(status: CommentsApi.CommentStatus) {
  return (
    commentStatusOptions.find((item) => item.value === status)?.label ?? status
  );
}

export function getCommentStatusColor(status: CommentsApi.CommentStatus) {
  switch (status) {
    case 'approved': {
      return 'success';
    }
    case 'pending': {
      return 'processing';
    }
    case 'rejected': {
      return 'error';
    }
    case 'spam': {
      return 'warning';
    }
    default: {
      return 'default';
    }
  }
}

async function getPostFilterOptions() {
  const { items } = await getPostsApi({ page: 1, pageSize: 200 });
  return items;
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '搜索昵称或评论内容',
      },
      fieldName: 'keyword',
      label: '关键词',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: getPostFilterOptions,
        labelField: 'title',
        placeholder: '全部文章',
        showSearch: true,
        style: { minWidth: '200px' },
        valueField: 'id',
      },
      fieldName: 'postId',
      label: '文章',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [...commentStatusOptions],
        placeholder: '全部状态',
      },
      fieldName: 'status',
      label: '状态',
    },
  ];
}

export function useReplySchema(): VbenFormSchema[] {
  return [
    {
      component: 'Textarea',
      componentProps: {
        maxlength: 2000,
        rows: 4,
        showCount: true,
      },
      fieldName: 'content',
      label: '回复内容',
      rules: z.string().min(1, '请输入回复内容').max(2000, '最多 2000 字'),
    },
  ];
}

export function useColumns(): VxeTableGridColumns<CommentsApi.ListItem> {
  return [
    { title: '序号', type: 'seq', width: 60 },
    {
      field: 'post.title',
      minWidth: 140,
      showOverflow: true,
      title: '文章',
    },
    {
      field: 'nickname',
      title: '昵称',
      width: 100,
    },
    {
      field: 'content',
      minWidth: 200,
      showOverflow: true,
      title: '内容',
    },
    {
      field: 'status',
      slots: { default: 'status' },
      title: '状态',
      width: 90,
    },
    {
      field: 'parentId',
      formatter: ({ cellValue }) => (cellValue ? '回复' : '主评论'),
      title: '类型',
      width: 80,
    },
    {
      field: 'ip',
      title: 'IP',
      width: 120,
    },
    {
      field: 'createdAt',
      formatter: 'formatDateTime',
      title: '时间',
      width: 170,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 200,
    },
  ];
}

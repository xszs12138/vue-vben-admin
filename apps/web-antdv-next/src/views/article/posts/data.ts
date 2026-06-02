import type { VxeTableGridColumns } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { PostsApi } from '#/api/core/posts';

import { z } from '#/adapter/form';
import { getCategoryOptionsApi } from '#/api/core/categories';
import { getTagOptionsApi } from '#/api/core/tags';

export const postStatusOptions = [
  { label: '草稿', value: 'draft' },
  { label: '已发布', value: 'published' },
  { label: '已下架', value: 'archived' },
] as const;

export function getPostStatusLabel(status: PostsApi.PostStatus) {
  return (
    postStatusOptions.find((item) => item.value === status)?.label ?? status
  );
}

export function getPostStatusColor(status: PostsApi.PostStatus) {
  switch (status) {
    case 'archived': {
      return 'warning';
    }
    case 'published': {
      return 'success';
    }
    default: {
      return 'default';
    }
  }
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '搜索标题、摘要、正文',
      },
      fieldName: 'keyword',
      label: '关键词',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [...postStatusOptions],
        placeholder: '全部状态',
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: getCategoryOptionsApi,
        valueField: 'id',
        labelField: 'name',
        placeholder: '请选择分类',
      },
      fieldName: 'categoryId',
      label: '分类',
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: '标题',
      rules: z.string().min(1, '请输入标题').max(160, '标题最多 160 字'),
    },
    {
      component: 'Input',
      fieldName: 'slug',
      label: '副标题',
      rules: z
        .string()
        .min(1, '请输入副标题')
        .max(180, '副标题最多 180 字')
        .regex(/^[a-z0-9-]+$/, '仅小写字母、数字和短横线'),
    },
    {
      component: 'ImageUpload',
      componentProps: {
        accept: 'image/*',
        maxSize: 5,
      },
      fieldName: 'cover',
      label: '封面图',
      rules: z.string().max(512).optional(),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxlength: 500,
        rows: 2,
        showCount: true,
      },
      fieldName: 'summary',
      label: '摘要',
      rules: z.string().max(500).optional(),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: getCategoryOptionsApi,
        labelField: 'name',
        placeholder: '请选择分类',
        showSearch: true,
        style: { width: '100%' },
        valueField: 'id',
      },
      fieldName: 'categoryId',
      label: '分类',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: getTagOptionsApi,
        labelField: 'name',
        maxTagCount: 'responsive',
        mode: 'multiple',
        placeholder: '请选择标签',
        showSearch: true,
        style: { width: '100%' },
        valueField: 'id',
      },
      defaultValue: [],
      fieldName: 'tagIds',
      label: '标签',
    },
    {
      component: 'RichEditor',
      fieldName: 'content',
      formItemClass: 'col-span-full',
      label: '正文',
      rules: z
        .string()
        .refine(
          (value) => value.replaceAll(/<[^>]+>/g, '').trim().length > 0,
          '请输入正文',
        ),
    },
    {
      component: 'Select',
      componentProps: {
        options: [...postStatusOptions],
        placeholder: '请选择状态',
        style: {
          width: '200px',
        },
      },
      defaultValue: 'draft',
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'Switch',
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
      defaultValue: false,
      fieldName: 'isPinned',
      label: '置顶',
    },
  ];
}

export function useColumns(): VxeTableGridColumns<PostsApi.ListItem> {
  return [
    { title: '序号', type: 'seq', width: 60 },
    {
      field: 'title',
      title: '标题',
    },
    {
      field: 'slug',
      title: '副标题',
      width: 140,
    },
    {
      field: 'status',
      slots: { default: 'status' },
      title: '状态',
      width: 100,
    },
    {
      field: 'cover',
      cellRender: { name: 'CellImage' },
      title: '封面',
      width: 100,
    },
    {
      field: 'category.name',
      slots: { default: 'category' },
      title: '分类',
      width: 100,
    },
    {
      field: 'tags',
      slots: { default: 'tags' },
      minWidth: 120,
      showOverflow: true,
      title: '标签',
    },
    {
      field: 'viewCount',
      title: '浏览量',
      width: 90,
    },
    {
      field: 'isPinned',
      formatter: ({ cellValue }) => (cellValue ? '是' : '否'),
      title: '置顶',
      width: 70,
    },
    {
      field: 'publishedAt',
      formatter: 'formatDateTime',
      title: '发布时间',
      width: 170,
    },
    {
      field: 'updatedAt',
      formatter: 'formatDateTime',
      title: '更新时间',
      width: 170,
    },
    {
      field: 'action',
      slots: { default: 'action' },
      title: '操作',
    },
  ];
}

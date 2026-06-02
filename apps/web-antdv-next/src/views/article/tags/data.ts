import type { VxeTableGridColumns } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { TagsApi } from '#/api/core/tags';

import { z } from '#/adapter/form';

const slugRule = z
  .string()
  .min(1, '请输入标识')
  .max(96, '标识最多 96 字')
  .regex(/^[a-z0-9-]+$/, '仅小写字母、数字和短横线');

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '搜索名称或标识',
      },
      fieldName: 'keyword',
      label: '关键词',
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
      rules: z.string().min(1, '请输入名称').max(64, '名称最多 64 字'),
    },
    {
      component: 'Input',
      fieldName: 'slug',
      label: '标识',
      rules: slugRule,
    },
    {
      component: 'Textarea',
      componentProps: {
        maxlength: 255,
        rows: 2,
        showCount: true,
      },
      fieldName: 'description',
      label: '描述',
      rules: z.string().max(255).optional(),
    },
    {
      component: 'InputNumber',
      componentProps: {
        max: 9999,
        min: 0,
        style: { width: '200px' },
      },
      defaultValue: 100,
      fieldName: 'sort',
      label: '排序',
      help: '数值越小越靠前',
    },
    {
      component: 'Switch',
      componentProps: {
        checkedChildren: '显示',
        unCheckedChildren: '隐藏',
      },
      defaultValue: true,
      fieldName: 'visible',
      label: '前台可见',
    },
  ];
}

export function useColumns(): VxeTableGridColumns<TagsApi.ListItem> {
  return [
    { title: '序号', type: 'seq', width: 60 },
    { field: 'name', title: '名称', minWidth: 120 },
    { field: 'slug', title: '标识', width: 140 },
    {
      field: 'description',
      formatter: ({ cellValue }) => cellValue || '-',
      minWidth: 160,
      showOverflow: true,
      title: '描述',
    },
    { field: 'sort', title: '排序', width: 80 },
    {
      field: 'visible',
      formatter: ({ cellValue }) => (cellValue ? '是' : '否'),
      title: '前台可见',
      width: 90,
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
      width: 140,
    },
  ];
}

import type { VxeTableGridColumns } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { DictionariesApi } from '#/api/core/dictionaries';

import { z } from '#/adapter/form';

const keyRule = z
  .string()
  .min(1, '请输入名称')
  .max(64, '最多 64 字')
  .regex(/^[a-z0-9-]+$/, '仅小写字母、数字和短横线');

const codeRule = z
  .string()
  .min(1, '请输入键')
  .max(64, '最多 64 字')
  .regex(/^[a-z0-9_-]+$/, '仅小写字母、数字、短横线与下划线');

export function useTypeFormSchema(isEdit: boolean): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '展示名称',
      rules: z.string().min(1, '请输入展示名称').max(64, '最多 64 字'),
    },
    {
      component: 'Input',
      componentProps: {
        disabled: isEdit,
        placeholder: '如 game-genre',
      },
      fieldName: 'key',
      label: '名称',
      rules: isEdit ? undefined : keyRule,
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入',
        rows: 3,
      },
      fieldName: 'description',
      label: '描述',
      rules: z.string().max(255).optional(),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: [
          { label: '启用', value: true },
          { label: '停用', value: false },
        ],
      },
      defaultValue: true,
      fieldName: 'enabled',
      label: '状态',
    },
  ];
}

export function useItemFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      fieldName: 'label',
      label: '展示名称',
      rules: z.string().min(1, '请输入展示名称').max(64, '最多 64 字'),
    },
    {
      component: 'Input',
      componentProps: { placeholder: '如 rpg、login' },
      fieldName: 'code',
      label: '键',
      rules: codeRule,
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        precision: 0,
        style: { width: '100%' },
      },
      fieldName: 'value',
      label: '值',
      rules: z.number().int().positive('值须为正整数'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        max: 9999,
        min: 0,
        precision: 0,
        style: { width: '100%' },
      },
      defaultValue: 100,
      fieldName: 'sort',
      label: '排序',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: [
          { label: '启用', value: true },
          { label: '停用', value: false },
        ],
      },
      defaultValue: true,
      fieldName: 'enabled',
      label: '状态',
    },
  ];
}

export function useTypeColumns(): VxeTableGridColumns<DictionariesApi.DictType> {
  return [
    { field: 'name', minWidth: 160, title: '展示名称' },
    { field: 'key', minWidth: 180, title: '名称' },
    {
      field: 'enabled',
      slots: { default: 'enabled' },
      title: '状态',
      width: 100,
    },
    {
      field: 'createdAt',
      formatter: ({ cellValue }) => cellValue || '-',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 140,
    },
  ];
}

export function useItemColumns(): VxeTableGridColumns<DictionariesApi.DictItem> {
  return [
    { type: 'checkbox', width: 48 },
    { field: 'label', minWidth: 120, title: '展示名称' },
    { field: 'code', minWidth: 120, title: '键' },
    { field: 'value', title: '值', width: 80 },
    { field: 'sort', title: '排序', width: 80 },
    {
      field: 'enabled',
      slots: { default: 'enabled' },
      title: '状态',
      width: 100,
    },
    {
      field: 'createdAt',
      formatter: 'formatDateTime',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 100,
    },
  ];
}

export function isSystemOperationItem(
  dictType: string,
  row: DictionariesApi.DictItem,
) {
  return dictType === 'operation' && (row.value === 1 || row.value === 2);
}

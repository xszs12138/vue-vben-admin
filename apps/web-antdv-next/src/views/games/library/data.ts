import type { VxeTableGridColumns } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { GamesApi } from '#/api/core/games';

import { z } from '#/adapter/form';
import { getDictionaryItemsApi } from '#/api/core/dictionaries';

/** 游戏类型选项（字典 game-genre，值为 code） */
export async function getGameGenreOptionsApi() {
  const items = await getDictionaryItemsApi('game-genre');
  return items
    .filter((item) => item.enabled && item.code)
    .toSorted((a, b) => a.sort - b.sort)
    .map((item) => ({
      label: item.label,
      value: item.code,
    }));
}

export const playStatusOptions = [
  { label: '正在游玩', value: 'playing' },
  { label: '已完成', value: 'completed' },
  { label: '搁置', value: 'backlog' },
  { label: '弃坑', value: 'dropped' },
  { label: '隐藏', value: 'hidden' },
] as const;

export const progressSourceOptions = [
  { label: 'Steam 成就', value: 'achievement' },
  { label: '手动', value: 'manual' },
  { label: '无', value: 'none' },
] as const;

export function getPlayStatusLabel(status: GamesApi.PlayStatus) {
  return (
    playStatusOptions.find((item) => item.value === status)?.label ?? status
  );
}

export function getProgressSourceLabel(source: GamesApi.ProgressSource) {
  return (
    progressSourceOptions.find((item) => item.value === source)?.label ?? source
  );
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'nameZh',
      label: '中文名',
      rules: z.string().max(255).optional(),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: getGameGenreOptionsApi,
        labelField: 'label',
        maxTagCount: 'responsive',
        mode: 'multiple',
        placeholder: '请选择游戏类型',
        showSearch: true,
        style: { width: '100%' },
        valueField: 'value',
      },
      defaultValue: [],
      fieldName: 'genres',
      help: '选项来自「字典管理 → 游戏类型」',
      label: '类型',
    },
    {
      component: 'Select',
      componentProps: {
        options: [...playStatusOptions],
      },
      fieldName: 'playStatus',
      label: '游玩状态',
      rules: z.enum(['playing', 'completed', 'backlog', 'dropped', 'hidden']),
    },
    {
      component: 'InputNumber',
      componentProps: {
        max: 100,
        min: 0,
        precision: 0,
        style: { width: '200px' },
      },
      fieldName: 'progressPercent',
      help: '留空表示不展示进度条；同步时 Steam 成就会覆盖手动值',
      label: '进度（%）',
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
        checkedChildren: '展示',
        unCheckedChildren: '隐藏',
      },
      defaultValue: false,
      fieldName: 'isVisible',
      label: '博客可见',
    },
  ];
}

export function useColumns(): VxeTableGridColumns<GamesApi.ListItem> {
  return [
    { title: '序号', type: 'seq', width: 60 },
    {
      field: 'cover',
      slots: { default: 'cover' },
      title: '封面',
      width: 100,
    },
    {
      field: 'nameZh',
      formatter: ({ row }) => row.nameZh || row.name,
      minWidth: 160,
      showOverflow: true,
      title: '游戏',
    },
    { field: 'steamAppId', title: 'AppID', width: 100 },
    {
      field: 'genres',
      formatter: ({ cellValue }) =>
        Array.isArray(cellValue) && cellValue.length > 0
          ? cellValue.join(' / ')
          : '-',
      minWidth: 140,
      showOverflow: true,
      title: '类型',
    },
    {
      field: 'playtimeHours',
      formatter: ({ cellValue }) => `${cellValue ?? 0} h`,
      title: '总时长',
      width: 90,
    },
    {
      field: 'progressPercent',
      formatter: ({ cellValue, row }) => {
        if (cellValue === null || cellValue === undefined) {
          return '-';
        }
        return `${cellValue}% (${getProgressSourceLabel(row.progressSource)})`;
      },
      minWidth: 130,
      title: '进度',
    },
    {
      field: 'playStatus',
      formatter: ({ cellValue }) =>
        getPlayStatusLabel(cellValue as GamesApi.PlayStatus),
      title: '状态',
      width: 100,
    },
    {
      field: 'isVisible',
      formatter: ({ cellValue }) => (cellValue ? '是' : '否'),
      title: '博客展示',
      width: 90,
    },
    { field: 'sort', title: '排序', width: 70 },
    {
      field: 'syncedAt',
      formatter: 'formatDateTime',
      title: '同步时间',
      width: 170,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 90,
    },
  ];
}

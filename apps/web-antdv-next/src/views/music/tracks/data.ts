import type { VxeTableGridColumns } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { MusicApi } from '#/api/core/music';

import { z } from '#/adapter/form';

function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) {
    return '-';
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '搜索曲名或歌手',
      },
      fieldName: 'keyword',
      label: '关键词',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '前台可见', value: true },
          { label: '前台隐藏', value: false },
        ],
        placeholder: '可见性',
      },
      fieldName: 'visible',
      label: '可见性',
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '曲名',
      rules: z.string().min(1, '请输入曲名').max(160, '曲名最多 160 字'),
    },
    {
      component: 'Input',
      fieldName: 'artist',
      label: '歌手',
      rules: z.string().max(128, '歌手最多 128 字').optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'https://... 或 /path/to/audio.mp3',
      },
      fieldName: 'audioUrl',
      help: '音频文件完整 URL，可上传到图床后粘贴链接',
      label: '音频地址',
      rules: z.string().min(1, '请输入音频地址').max(512, '地址最多 512 字'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'https://...',
      },
      fieldName: 'coverUrl',
      label: '封面地址',
      rules: z.string().max(512).optional(),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxlength: 50_000,
        placeholder: '可粘贴 LRC 歌词，或填写 .lrc 文件 URL',
        rows: 8,
        showCount: true,
      },
      fieldName: 'lrc',
      label: '歌词 (LRC)',
      rules: z.string().optional(),
    },
    {
      component: 'InputNumber',
      componentProps: {
        max: 86_400,
        min: 0,
        style: { width: '200px' },
      },
      defaultValue: 0,
      fieldName: 'durationSeconds',
      help: '可选，单位秒；0 表示未知',
      label: '时长 (秒)',
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
      help: '数值越小越靠前',
      label: '排序',
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

export function useColumns(): VxeTableGridColumns<MusicApi.ListItem> {
  return [
    { title: '序号', type: 'seq', width: 60 },
    { field: 'name', minWidth: 140, title: '曲名' },
    {
      field: 'artist',
      formatter: ({ cellValue }) => cellValue || '-',
      minWidth: 120,
      title: '歌手',
    },
    {
      field: 'durationSeconds',
      formatter: ({ cellValue }) => formatDuration(Number(cellValue)),
      title: '时长',
      width: 80,
    },
    { field: 'sort', title: '排序', width: 72 },
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

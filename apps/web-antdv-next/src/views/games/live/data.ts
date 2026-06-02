import type { VbenFormSchema } from '#/adapter/form';
import type { LiveApi } from '#/api/core/live';

import { z } from '#/adapter/form';

export const livePlatformOptions = [
  { label: '哔哩哔哩', value: 'bilibili' },
] as const;

export function useLiveFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Switch',
      componentProps: {
        checkedChildren: '开播中',
        unCheckedChildren: '未开播',
      },
      defaultValue: false,
      fieldName: 'isLive',
      label: '开播状态',
    },
    {
      component: 'Select',
      componentProps: {
        options: [...livePlatformOptions],
      },
      defaultValue: 'bilibili',
      fieldName: 'platform',
      label: '直播平台',
      rules: z.enum(['bilibili']),
    },
    {
      component: 'Input',
      fieldName: 'roomTitle',
      label: '直播间标题',
      rules: z.string().min(1, '请输入直播间标题').max(120),
    },
    {
      component: 'Input',
      fieldName: 'streamTitle',
      label: '直播标题',
      rules: z.string().min(1, '请输入直播标题').max(160),
    },
    {
      component: 'Input',
      fieldName: 'subtitle',
      label: '副标题',
      rules: z.string().max(255).optional(),
    },
    {
      component: 'ImageUpload',
      fieldName: 'cover',
      label: '直播封面',
      help: '建议 16:9，可通过图床上传',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'https://live.bilibili.com/...',
      },
      fieldName: 'streamUrl',
      label: '直播链接',
      rules: z.string().url('请输入有效的直播链接'),
    },
  ];
}

export function toLivePayload(
  values: Record<string, unknown>,
): LiveApi.UpdateParams {
  return {
    isLive: Boolean(values.isLive),
    platform: (values.platform as LiveApi.Platform) || 'bilibili',
    roomTitle: String(values.roomTitle ?? '').trim(),
    streamTitle: String(values.streamTitle ?? '').trim(),
    subtitle: String(values.subtitle ?? '').trim(),
    cover: String(values.cover ?? '').trim(),
    streamUrl: String(values.streamUrl ?? '').trim(),
  };
}

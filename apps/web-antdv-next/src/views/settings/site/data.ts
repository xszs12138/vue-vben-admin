import type { VbenFormSchema } from '#/adapter/form';

import { z } from '#/adapter/form';

export function useSiteSettingsFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '站点名称',
      rules: z.string().min(1, '请输入站点名称').max(120),
    },
    {
      component: 'Textarea',
      componentProps: {
        autoSize: { minRows: 2, maxRows: 4 },
        maxlength: 500,
        showCount: true,
      },
      fieldName: 'description',
      label: '站点描述',
      rules: z.string().max(500).optional(),
    },
    {
      component: 'ImageUpload',
      fieldName: 'logo',
      label: '站点 Logo',
      help: '建议正方形透明图，可通过图床上传',
    },
    {
      component: 'Input',
      fieldName: 'icp',
      label: 'ICP 备案号',
      componentProps: {
        placeholder: '例如：京ICP备xxxxxxxx号',
      },
      rules: z.string().max(64).optional(),
    },
  ];
}

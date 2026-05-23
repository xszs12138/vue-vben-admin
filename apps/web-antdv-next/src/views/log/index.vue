<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
// import dayjs from 'dayjs';

import { message } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getLogsApi } from '#/api/core/logs';

interface LogItem {
  id: number;
  userId: number;
  username: string;
  actionValue: number;
  actionLabel: string;
  ip: string;
  region: string;
  userAgent: string;
  createdAt: string;
}

// const formOptions: VbenFormProps = {
//   // 默认展开
//   collapsed: false,
//   fieldMappingTime: [['date', ['start', 'end']]],
//   schema: [
//     {
//       component: 'Input',
//       defaultValue: '1',
//       fieldName: 'category',
//       label: 'Category',
//     },
//     {
//       component: 'Input',
//       fieldName: 'productName',
//       label: 'ProductName',
//     },
//     {
//       component: 'Input',
//       fieldName: 'price',
//       label: 'Price',
//     },
//     {
//       component: 'Select',
//       componentProps: {
//         allowClear: true,
//         options: [
//           {
//             label: 'Color1',
//             value: '1',
//           },
//           {
//             label: 'Color2',
//             value: '2',
//           },
//         ],
//         placeholder: '请选择',
//       },
//       fieldName: 'color',
//       label: 'Color',
//     },
//     {
//       component: 'RangePicker',
//       defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
//       fieldName: 'date',
//       label: 'Date',
//     },
//   ],
//   // 控制表单是否显示折叠按钮
//   showCollapseButton: true,
//   // 是否在字段值改变时提交表单
//   submitOnChange: true,
//   // 按下回车时是否提交表单
//   submitOnEnter: false,
// };

const gridOptions: VxeTableGridOptions<LogItem> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'username', title: '用户名' },
    { field: 'ip', title: 'IP地址' },
    { field: 'actionLabel', title: '行为' },
    { field: 'userAgent', title: '用户代理' },
    { field: 'createdAt', formatter: 'formatDateTime', title: '创建时间' },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        message.success(`Query params: ${JSON.stringify(formValues)}`);
        return await getLogsApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
};

const [Grid] = useVbenVxeGrid({
  // formOptions,
  gridOptions,
});
</script>
<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
<style scoped></style>

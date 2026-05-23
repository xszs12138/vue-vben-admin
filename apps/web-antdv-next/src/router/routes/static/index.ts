import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:cog',
      title: '系统设置',
    },
    name: 'settings',
    path: '/settings',
    redirect: '/settings/logs',
    children: [
      {
        name: 'SettingsIndex',
        path: '/settings/logs',
        component: () => import('#/views/log/index.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: '日志管理',
        },
      },
    ],
  },
];

export default routes;

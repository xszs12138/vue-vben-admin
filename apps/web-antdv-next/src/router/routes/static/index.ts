import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:home',
      title: '系统设置',
    },
    name: 'settings',
    path: '/settings',
    redirect: '/settings/logs',
    children: [
      {
        name: 'SettingsIndex',
        path: '/settings/logs',
        component: () => import('#/views/logs/index.vue'),
        meta: {
          icon: 'mdi:home',
          title: '日志管理',
        },
      },
    ],
  },
];

export default routes;

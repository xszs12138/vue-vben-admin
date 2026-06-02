import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:stack-overflow',
      title: '内容管理',
    },
    name: 'article',
    path: '/article',
    redirect: '/posts',
    children: [
      {
        meta: {
          icon: 'mdi:post',
          title: '文章管理',
        },
        name: 'PostsIndex',
        path: '/article/posts',
        component: () => import('#/views/article/posts/index.vue'),
      },
      {
        meta: {
          icon: 'mdi:tag',
          title: '标签管理',
        },
        name: 'TagsIndex',
        path: '/article/tags',
        component: () => import('#/views/article/tags/index.vue'),
      },
      {
        meta: {
          icon: 'mdi:category',
          title: '分类管理',
        },
        name: 'CategoriesIndex',
        path: '/article/categories',
        component: () => import('#/views/article/categories/index.vue'),
      },
      {
        meta: {
          icon: 'mdi:comment-text-outline',
          title: '评论管理',
        },
        name: 'CommentsIndex',
        path: '/article/comments',
        component: () => import('#/views/article/comments/index.vue'),
      },
    ],
  },
  {
    meta: {
      icon: 'mdi:music',
      title: '音乐管理',
    },
    name: 'music',
    path: '/music',
    redirect: '/music/tracks',
    children: [
      {
        meta: {
          icon: 'mdi:music-note',
          title: '曲目管理',
        },
        name: 'MusicTracksIndex',
        path: '/music/tracks',
        component: () => import('#/views/music/tracks/index.vue'),
      },
    ],
  },
  {
    meta: {
      icon: 'mdi:gamepad-variant',
      title: '游戏管理',
    },
    name: 'games',
    path: '/games',
    redirect: '/games/library',
    children: [
      {
        meta: {
          icon: 'mdi:steam',
          title: '游戏库',
        },
        name: 'GamesLibraryIndex',
        path: '/games/library',
        component: () => import('#/views/games/library/index.vue'),
      },
      {
        meta: {
          icon: 'mdi:broadcast',
          title: '直播管理',
        },
        name: 'GamesLiveIndex',
        path: '/games/live',
        component: () => import('#/views/games/live/index.vue'),
      },
    ],
  },
  {
    meta: {
      icon: 'mdi:image-search',
      title: '图床服务管理',
    },
    name: 'ImageBedIndex',
    path: '/imageBed',
    redirect: '/imageBed/images',
    children: [
      {
        meta: {
          icon: 'mdi:image',
          title: '图片管理',
        },
        name: 'ImageBedImagesIndex',
        path: '/imageBed/images',
        component: () => import('#/views/imageBed/images/index.vue'),
      },
      {
        meta: {
          icon: 'mdi:image-album',
          title: '相册管理',
        },
        name: 'ImageBedAlbumsIndex',
        path: '/imageBed/albums',
        component: () => import('#/views/imageBed/albums/index.vue'),
      },
    ],
  },
  {
    meta: {
      icon: 'mdi:cog',
      title: '系统设置',
    },
    name: 'settings',
    path: '/settings',
    redirect: '/settings/site',
    children: [
      {
        name: 'SiteSettingsIndex',
        path: '/settings/site',
        component: () => import('#/views/settings/site/index.vue'),
        meta: {
          icon: 'mdi:web',
          title: '站点设置',
        },
      },
      {
        name: 'SettingsIndex',
        path: '/settings/logs',
        component: () => import('#/views/log/index.vue'),
        meta: {
          icon: 'mdi:format-list-bulleted',
          title: '日志管理',
        },
      },
      {
        name: 'DictionariesIndex',
        path: '/settings/dictionaries',
        component: () => import('#/views/settings/dictionaries/index.vue'),
        meta: {
          icon: 'mdi:book-alphabet',
          title: '字典管理',
        },
      },
    ],
  },
];

export default routes;

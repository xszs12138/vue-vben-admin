<script setup lang="ts">
import type { ImageBedProfile } from '#/api';

import { computed } from 'vue';

import { Collapse, CollapsePanel, Descriptions } from 'antdv-next';

import { getDescriptionItemFromSchema } from '#/utils';

const props = defineProps<{
  profile: ImageBedProfile;
}>();

const schema = [
  { key: 'name', label: '昵称' },
  { key: 'email', label: '邮箱' },
  { key: 'capacity', label: '总容量' },
  { key: 'size', label: '已使用容量' },
  { key: 'image_num', label: '图片数量' },
  { key: 'album_num', label: '相册数量' },
  { key: 'registered_ip', label: '注册IP' },
];

const items = computed(() => {
  return getDescriptionItemFromSchema(schema, props.profile);
});
</script>
<template>
  <Collapse default-active-key="profile">
    <CollapsePanel key="profile" header="图床账户信息">
      <Descriptions :items="items" bordered />
    </CollapsePanel>
  </Collapse>
</template>

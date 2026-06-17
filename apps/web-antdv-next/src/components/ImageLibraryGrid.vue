<script lang="ts" setup>
import type { ImageBedListItem } from '#/api/image-bed';

import { Image } from 'antdv-next';

import {
  getImageBedItemThumb,
  getImageBedItemUrl,
} from '#/composables/use-image-library';

const props = defineProps<{
  images: ImageBedListItem[];
  multiple?: boolean;
  selectedUrls: string[];
}>();

const emit = defineEmits<{
  select: [url: string, item: ImageBedListItem];
}>();

function isSelected(url: string) {
  return props.selectedUrls.includes(url);
}

function handleSelect(item: ImageBedListItem) {
  const url = getImageBedItemUrl(item);
  if (!url) {
    return;
  }
  emit('select', url, item);
}
</script>

<template>
  <ul
    class="grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-4 md:grid-cols-5"
  >
    <li
      v-for="item in images"
      :key="item.key"
      class="group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-colors"
      :class="
        isSelected(getImageBedItemUrl(item))
          ? 'border-primary'
          : 'border-transparent hover:border-border'
      "
      @click="handleSelect(item)"
    >
      <Image
        :alt="item.origin_name"
        :preview="false"
        :src="getImageBedItemThumb(item)"
        class="aspect-square w-full object-cover"
      />
      <div
        v-if="isSelected(getImageBedItemUrl(item))"
        class="absolute inset-0 flex items-center justify-center bg-primary/20"
      >
        <span
          class="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-white"
        >
          ✓
        </span>
      </div>
      <p
        class="truncate px-1 py-1 text-center text-xs text-foreground/70"
        :title="item.origin_name"
      >
        {{ item.origin_name }}
      </p>
    </li>
  </ul>
</template>

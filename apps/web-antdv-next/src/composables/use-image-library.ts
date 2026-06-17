import type { ImageBedListItem } from '#/api/image-bed';

import { ref } from 'vue';

import { getImageBedImages } from '#/api/image-bed';

export function useImageLibrary() {
  const images = ref<ImageBedListItem[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const lastPage = ref(1);
  const total = ref(0);
  const perPage = ref(40);
  const keyword = ref('');

  async function load(pageNum = page.value) {
    loading.value = true;
    try {
      const res = await getImageBedImages({
        page: pageNum,
        order: 'newest',
        q: keyword.value.trim() || undefined,
      });
      images.value = res.data;
      page.value = res.current_page;
      lastPage.value = res.last_page;
      total.value = res.total;
      perPage.value = res.per_page;
    } finally {
      loading.value = false;
    }
  }

  async function search() {
    page.value = 1;
    await load(1);
  }

  async function changePage(next: number) {
    if (next < 1 || next > lastPage.value) {
      return;
    }
    await load(next);
  }

  return {
    changePage,
    images,
    keyword,
    lastPage,
    load,
    loading,
    page,
    perPage,
    search,
    total,
  };
}

export function getImageBedItemUrl(item: ImageBedListItem) {
  return item.links?.url ?? '';
}

export function getImageBedItemThumb(item: ImageBedListItem) {
  return item.links?.thumbnail_url || item.links?.url || '';
}

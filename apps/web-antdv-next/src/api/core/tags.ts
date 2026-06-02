import { requestClient } from '#/api/request';

export namespace TagsApi {
  export interface ListItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    sort: number;
    visible: boolean;
    createdAt: string;
    updatedAt: string;
  }

  export type Detail = ListItem;

  export interface PageResult<T> {
    items: T[];
    total: number;
  }

  export interface PageParams {
    page?: number;
    pageSize?: number;
    keyword?: string;
  }

  export interface SaveParams {
    name: string;
    slug: string;
    description?: string;
    sort?: number;
    visible?: boolean;
  }
}

export async function getTagsApi(params: TagsApi.PageParams) {
  return requestClient.get<TagsApi.PageResult<TagsApi.ListItem>>(
    '/admin/tags',
    { params },
  );
}

/** 下拉选项：拉取全部标签 */
export async function getTagOptionsApi() {
  const { items } = await getTagsApi({ page: 1, pageSize: 500 });
  return items;
}

export async function getTagApi(id: number) {
  return requestClient.get<TagsApi.Detail>(`/admin/tags/${id}`);
}

export async function createTagApi(data: TagsApi.SaveParams) {
  return requestClient.post<{ id: number }>('/admin/tags', data);
}

export async function updateTagApi(id: number, data: TagsApi.SaveParams) {
  return requestClient.post<{ id: number }>(`/admin/tags/${id}/update`, data);
}

export async function deleteTagApi(id: number) {
  return requestClient.post<boolean>(`/admin/tags/${id}/delete`);
}

import { requestClient } from '#/api/request';

export namespace CategoriesApi {
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

export async function getCategoriesApi(params: CategoriesApi.PageParams) {
  return requestClient.get<CategoriesApi.PageResult<CategoriesApi.ListItem>>(
    '/admin/categories',
    { params },
  );
}

/** 下拉选项：拉取全部分类 */
export async function getCategoryOptionsApi() {
  const { items } = await getCategoriesApi({ page: 1, pageSize: 500 });
  return items;
}

export async function getCategoryApi(id: number) {
  return requestClient.get<CategoriesApi.Detail>(`/admin/categories/${id}`);
}

export async function createCategoryApi(data: CategoriesApi.SaveParams) {
  return requestClient.post<{ id: number }>('/admin/categories', data);
}

export async function updateCategoryApi(
  id: number,
  data: CategoriesApi.SaveParams,
) {
  return requestClient.post<{ id: number }>(
    `/admin/categories/${id}/update`,
    data,
  );
}

export async function deleteCategoryApi(id: number) {
  return requestClient.post<boolean>(`/admin/categories/${id}/delete`);
}

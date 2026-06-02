import { requestClient } from '#/api/request';

export namespace PostsApi {
  export type PostStatus = 'archived' | 'draft' | 'published';

  export interface CategoryRef {
    id: number;
    name: string;
  }

  export interface TagRef {
    id: number;
    name: string;
  }

  export interface ListItem {
    id: number;
    title: string;
    slug: string;
    cover: string;
    summary: string;
    status: PostStatus;
    isPinned: boolean;
    viewCount: number;
    category?: CategoryRef;
    tags: TagRef[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  }

  export interface Detail extends ListItem {
    content: string;
    contentType: string;
    categoryId?: number;
    tagIds: number[];
  }

  export interface PageResult<T> {
    items: T[];
    total: number;
  }

  export interface PageParams {
    page?: number;
    pageSize?: number;
    status?: PostStatus;
    categoryId?: number;
    tagId?: number;
    keyword?: string;
  }

  export interface SaveParams {
    title: string;
    slug: string;
    cover?: string;
    summary?: string;
    content: string;
    contentType?: string;
    status?: PostStatus;
    isPinned?: boolean;
    categoryId?: null | number;
    tagIds?: number[];
  }

  export interface StatusResult {
    id: number;
    status: PostStatus;
    publishedAt?: string;
  }
}

export async function getPostsApi(params: PostsApi.PageParams) {
  return requestClient.get<PostsApi.PageResult<PostsApi.ListItem>>(
    '/admin/posts',
    { params },
  );
}

export async function getPostApi(id: number) {
  return requestClient.get<PostsApi.Detail>(`/admin/posts/${id}`);
}

export async function createPostApi(data: PostsApi.SaveParams) {
  return requestClient.post<{ id: number }>('/admin/posts', data);
}

export async function updatePostApi(id: number, data: PostsApi.SaveParams) {
  return requestClient.post<{ id: number }>(`/admin/posts/${id}/update`, data);
}

export async function deletePostApi(id: number) {
  return requestClient.post<boolean>(`/admin/posts/${id}/delete`);
}

export async function updatePostStatusApi(
  id: number,
  status: PostsApi.PostStatus,
) {
  return requestClient.post<PostsApi.StatusResult>(
    `/admin/posts/${id}/status`,
    { status },
  );
}

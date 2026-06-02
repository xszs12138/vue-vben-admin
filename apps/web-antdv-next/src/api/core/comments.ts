import { requestClient } from '#/api/request';

export namespace CommentsApi {
  export type CommentStatus = 'approved' | 'pending' | 'rejected' | 'spam';

  export interface PostRef {
    id: number;
    title: string;
    slug: string;
  }

  export interface ListItem {
    id: number;
    post: PostRef;
    parentId?: null | number;
    nickname: string;
    email?: string;
    website?: string;
    content: string;
    status: CommentStatus;
    ip: string;
    createdAt: string;
  }

  export interface PageResult<T> {
    items: T[];
    total: number;
  }

  export interface PageParams {
    page?: number;
    pageSize?: number;
    postId?: number;
    status?: CommentStatus;
    keyword?: string;
  }

  export interface ReplyParams {
    content: string;
  }

  export interface StatusResult {
    id: number;
    status: CommentStatus;
  }
}

export async function getCommentsApi(params: CommentsApi.PageParams) {
  return requestClient.get<CommentsApi.PageResult<CommentsApi.ListItem>>(
    '/admin/comments',
    { params },
  );
}

export async function approveCommentApi(id: number) {
  return requestClient.post<CommentsApi.StatusResult>(
    `/admin/comments/${id}/approve`,
  );
}

export async function rejectCommentApi(id: number) {
  return requestClient.post<CommentsApi.StatusResult>(
    `/admin/comments/${id}/reject`,
  );
}

export async function deleteCommentApi(id: number) {
  return requestClient.post<boolean>(`/admin/comments/${id}/delete`);
}

export async function replyCommentApi(
  id: number,
  data: CommentsApi.ReplyParams,
) {
  return requestClient.post<{ id: number; status: string }>(
    `/admin/comments/${id}/reply`,
    data,
  );
}

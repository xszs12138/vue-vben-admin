import { requestClient } from '#/api/request';

export namespace MusicApi {
  export interface ListItem {
    id: number;
    name: string;
    artist: string;
    audioUrl: string;
    coverUrl: string;
    durationSeconds: number;
    sort: number;
    visible: boolean;
    createdAt: string;
    updatedAt: string;
  }

  export interface Detail extends ListItem {
    lrc: string;
  }

  export interface PageResult<T> {
    items: T[];
    total: number;
  }

  export interface PageParams {
    page?: number;
    pageSize?: number;
    keyword?: string;
    visible?: boolean;
  }

  export interface SaveParams {
    name: string;
    artist?: string;
    audioUrl: string;
    coverUrl?: string;
    lrc?: string;
    durationSeconds?: number;
    sort?: number;
    visible?: boolean;
  }
}

export async function getMusicTracksApi(params: MusicApi.PageParams) {
  return requestClient.get<MusicApi.PageResult<MusicApi.ListItem>>(
    '/admin/music/tracks',
    { params },
  );
}

export async function getMusicTrackApi(id: number) {
  return requestClient.get<MusicApi.Detail>(`/admin/music/tracks/${id}`);
}

export async function createMusicTrackApi(data: MusicApi.SaveParams) {
  return requestClient.post<{ id: number }>('/admin/music/tracks', data);
}

export async function updateMusicTrackApi(
  id: number,
  data: MusicApi.SaveParams,
) {
  return requestClient.post<{ id: number }>(
    `/admin/music/tracks/${id}/update`,
    data,
  );
}

export async function deleteMusicTrackApi(id: number) {
  return requestClient.post<boolean>(`/admin/music/tracks/${id}/delete`);
}

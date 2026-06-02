import { requestClient } from '#/api/request';

export namespace LiveApi {
  export type Platform = 'bilibili';

  export interface Broadcast {
    isLive: boolean;
    platform: Platform;
    platformLabel?: string;
    roomTitle: string;
    streamTitle: string;
    subtitle: string;
    cover: string;
    streamUrl: string;
  }

  export type UpdateParams = Broadcast;
}

export async function getLiveApi() {
  return requestClient.get<LiveApi.Broadcast>('/admin/live');
}

export async function updateLiveApi(data: LiveApi.UpdateParams) {
  return requestClient.post<LiveApi.Broadcast>('/admin/live/update', data);
}

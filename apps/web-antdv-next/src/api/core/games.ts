import { requestClient } from '#/api/request';

export namespace GamesApi {
  export type PlayStatus =
    | 'backlog'
    | 'completed'
    | 'dropped'
    | 'hidden'
    | 'playing';

  export type ProgressSource = 'achievement' | 'manual' | 'none';

  export interface ListItem {
    id: number;
    steamAppId: number;
    name: string;
    nameZh: string;
    cover: string;
    genres: string[];
    playStatus: PlayStatus;
    playStatusLabel?: string;
    progressPercent: null | number;
    progressSource: ProgressSource;
    playtimeHours: number;
    playtime2WeeksHours: number;
    playtimeMinutes: number;
    achievementUnlocked: null | number;
    achievementTotal: null | number;
    isVisible: boolean;
    sort: number;
    lastPlayedAt: null | string;
    syncedAt: null | string;
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
  }

  export interface UpdateParams {
    nameZh?: string;
    genres?: string[];
    playStatus?: PlayStatus;
    progressPercent?: null | number;
    isVisible?: boolean;
    sort?: number;
  }

  export interface SyncResult {
    syncedCount: number;
    visibleCount: number;
    syncedAt: string;
  }
}

export async function getGamesApi(params: GamesApi.PageParams) {
  return requestClient.get<GamesApi.PageResult<GamesApi.ListItem>>(
    '/admin/games',
    { params },
  );
}

export async function getGameApi(id: number) {
  return requestClient.get<GamesApi.Detail>(`/admin/games/${id}`);
}

export async function updateGameApi(id: number, data: GamesApi.UpdateParams) {
  return requestClient.post<GamesApi.Detail>(`/admin/games/${id}/update`, data);
}

export async function syncGamesApi() {
  return requestClient.post<GamesApi.SyncResult>('/admin/games/sync');
}

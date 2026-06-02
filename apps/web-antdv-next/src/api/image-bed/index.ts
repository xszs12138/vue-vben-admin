import type {
  CreateUploadTokensParams,
  ImageBedAlbumsPage,
  ImageBedImagesPage,
  ImageBedProfile,
  ImageBedStrategy,
  ImageBedUploadData,
  ImageBedUploadToken,
  ListAlbumsParams,
  ListImagesParams,
  UploadImageParams,
} from './types';

import { imageBedClient } from './client';

export { imageBedClient } from './client';
export * from './types';

/**
 * 上传图片 POST /upload
 */
export async function uploadImage({
  file,
  permission = 1,
  strategyId,
  albumId,
  expiredAt,
  token,
  onProgress,
}: UploadImageParams) {
  const data = await imageBedClient.upload<ImageBedUploadData>(
    '/upload',
    {
      file,
      permission,
      ...(strategyId === undefined ? {} : { strategy_id: strategyId }),
      ...(albumId === undefined ? {} : { album_id: albumId }),
      ...(expiredAt ? { expired_at: expiredAt } : {}),
      ...(token ? { token } : {}),
    },
    {
      onUploadProgress: (event) => {
        if (!event.total) {
          return;
        }
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      },
    },
  );

  return data;
}

/** 上传并返回可直接使用的图片 URL */
export async function uploadImageUrl(params: UploadImageParams) {
  const result = await uploadImage(params);
  const url = result.links?.url;
  if (!url) {
    throw new Error('图床未返回图片地址');
  }
  return url;
}

/**
 * 用户资料 GET /profile
 */
export function getImageBedProfile() {
  return imageBedClient.get<ImageBedProfile>('/profile');
}

/**
 * 策略列表 GET /strategies
 */
export function getImageBedStrategies(q?: string) {
  return imageBedClient.get<{ strategies: ImageBedStrategy[] }>('/strategies', {
    params: q ? { q } : undefined,
  });
}

/**
 * 图片列表 GET /images
 */
export function getImageBedImages(params?: ListImagesParams) {
  return imageBedClient.get<ImageBedImagesPage>('/images', {
    params: {
      page: params?.page,
      order: params?.order,
      permission: params?.permission,
      album_id: params?.albumId,
      q: params?.q,
    },
  });
}

/**
 * 删除图片 DELETE /images/:key
 */
export function deleteImageBedImage(key: string) {
  return imageBedClient.delete<unknown>(`/images/${encodeURIComponent(key)}`);
}

/**
 * 生成临时上传 Token POST /images/tokens
 */
export function createImageBedUploadTokens(params: CreateUploadTokensParams) {
  return imageBedClient.post<{ tokens: ImageBedUploadToken[] }>(
    '/images/tokens',
    params,
  );
}

/**
 * 相册列表 GET /albums
 */
export function getImageBedAlbums(params?: ListAlbumsParams) {
  return imageBedClient.get<ImageBedAlbumsPage>('/albums', {
    params: {
      page: params?.page,
      order: params?.order,
      q: params?.q,
    },
  });
}

/**
 * 删除相册 DELETE /albums/:id
 */
export function deleteImageBedAlbum(id: number) {
  return imageBedClient.delete<unknown>(`/albums/${id}`);
}

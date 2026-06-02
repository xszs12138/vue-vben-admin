/** 7bu 图床 API 通用响应，见 https://7bu.top/page/api-docs.html */

export interface ImageBedResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
}

export interface ImageBedLinks {
  url: string;
  html?: string;
  bbcode?: string;
  markdown?: string;
  markdown_with_link?: string;
  thumbnail_url?: string;
  delete_url?: string;
}

export interface ImageBedUploadData {
  key: string;
  name: string;
  pathname: string;
  origin_name: string;
  size: number;
  mimetype: string;
  extension: string;
  md5: string;
  sha1: string;
  links: ImageBedLinks;
}

export interface ImageBedProfile {
  username: string; // 用户名
  name: string; // 	昵称
  avatar: string; // 头像
  email: string; // 邮箱
  capacity: number; // 总容量
  size: number; // 已使用容量
  url: string; // 个人主页地址
  image_num: number; // 图片数量
  album_num: number; // 相册数量
  registered_ip: string; // 注册IP
}

export interface ImageBedListItem {
  key: string;
  name: string;
  origin_name: string;
  pathname: string;
  size: number;
  width: number;
  height: number;
  md5: string;
  sha1: string;
  human_date: string;
  date: string;
  links: ImageBedLinks;
}

export interface ImageBedImagesPage {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: ImageBedListItem[];
}

export interface ImageBedStrategy {
  id: number;
  name: string;
}

export interface UploadImageParams {
  file: File;
  /** 1=公开，0=私有，默认公开 */
  permission?: 0 | 1;
  strategyId?: number;
  albumId?: number;
  expiredAt?: string;
  /** 临时上传 Token，与 Bearer 二选一 */
  token?: string;
  onProgress?: (percent: number) => void;
}

export interface ListImagesParams {
  page?: number;
  order?: 'earliest' | 'least' | 'newest' | 'utmost';
  permission?: 'private' | 'public';
  albumId?: number;
  q?: string;
}

export interface CreateUploadTokensParams {
  num: number;
  seconds: number;
}

export interface ImageBedUploadToken {
  token: string;
  expired_at: string;
}

export interface ImageBedAlbum {
  id: number;
  name: string;
  intro: string;
  image_num: number;
}

export interface ImageBedAlbumsPage {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: ImageBedAlbum[];
}

export interface ListAlbumsParams {
  page?: number;
  /** newest=最新，earliest=最早，most=图片最多，least=图片最少 */
  order?: 'earliest' | 'least' | 'most' | 'newest';
  q?: string;
}

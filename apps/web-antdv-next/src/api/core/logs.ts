import { requestClient } from '#/api/request';

export namespace LogsApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

/**
 * 获取日志信息
 */

export async function getLogsApi(params: LogsApi.PageFetchParams) {
  return requestClient.get('/admin/operation-logs', { params });
}

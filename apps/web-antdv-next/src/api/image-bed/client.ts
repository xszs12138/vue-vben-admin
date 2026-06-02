/**
 * 7bu 图床独立 axios 客户端
 * @see https://7bu.top/page/api-docs.html
 */
import type { RequestClientOptions } from '@vben/request';

import {
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';

import { message } from 'antdv-next';

const DEFAULT_BASE_URL = 'https://7bu.top/api/v1';

function getImageBedApiUrl() {
  return (
    import.meta.env.VITE_GLOB_IMAGE_BED_API_URL ||
    import.meta.env.VITE_IMAGE_BED_API_URL ||
    DEFAULT_BASE_URL
  );
}

function getImageBedToken() {
  return (
    import.meta.env.VITE_GLOB_IMAGE_BED_TOKEN ||
    import.meta.env.VITE_IMAGE_BED_TOKEN ||
    ''
  );
}

function createImageBedClient(options?: RequestClientOptions) {
  const client = new RequestClient({
    baseURL: getImageBedApiUrl(),
    timeout: 60_000,
    ...options,
  });

  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const token = getImageBedToken();
      if (token && !config.headers?.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers.Accept = 'application/json';
      return config;
    },
  });

  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'status',
      dataField: 'data',
      successCode: (status: unknown) => status === true,
    }),
  );

  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg, error) => {
      const body = error?.response?.data as undefined | { message?: string };
      message.error(body?.message || msg);
    }),
  );

  return client;
}

export const imageBedClient = createImageBedClient({
  responseReturn: 'data',
});

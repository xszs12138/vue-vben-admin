import { requestClient } from '#/api/request';

export namespace DictionariesApi {
  export interface DictType {
    key: string;
    name: string;
    description: string;
    enabled: boolean;
    createdAt?: string;
    webPublic?: boolean;
  }

  export interface DictTypeSaveParams {
    name: string;
    description?: string;
    enabled: boolean;
  }

  export interface DictItem {
    id: number;
    dictType: string;
    value: number;
    code: string;
    label: string;
    enabled: boolean;
    sort: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface SaveParams {
    dictType: string;
    value: number;
    code: string;
    label: string;
    enabled?: boolean;
    sort?: number;
  }
}

export async function getDictionaryTypesApi() {
  return requestClient.get<DictionariesApi.DictType[]>('/admin/dictionaries');
}

export async function updateDictionaryTypeApi(
  dictType: string,
  data: DictionariesApi.DictTypeSaveParams,
) {
  return requestClient.post<boolean>(
    `/admin/dictionaries/${dictType}/update`,
    data,
  );
}

export async function getDictionaryItemsApi(dictType: string) {
  return requestClient.get<DictionariesApi.DictItem[]>(
    `/admin/dictionaries/${dictType}/items`,
  );
}

export async function createDictionaryItemApi(
  dictType: string,
  data: DictionariesApi.SaveParams,
) {
  return requestClient.post<DictionariesApi.DictItem>(
    `/admin/dictionaries/${dictType}/items`,
    { ...data, dictType },
  );
}

export async function updateDictionaryItemApi(
  id: number,
  data: DictionariesApi.SaveParams,
) {
  return requestClient.post<DictionariesApi.DictItem>(
    `/admin/dict-items/${id}/update`,
    data,
  );
}

export async function deleteDictionaryItemApi(id: number) {
  return requestClient.post<boolean>(`/admin/dict-items/${id}/delete`);
}

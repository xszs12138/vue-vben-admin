import { requestClient } from '#/api/request';

export namespace SiteSettingsApi {
  export interface SocialLink {
    name: string;
    url: string;
  }

  export interface Settings {
    name: string;
    description: string;
    logo: string;
    icp: string;
    about: string;
    socialLinks: SocialLink[];
  }

  export type UpdateParams = Settings;
}

export async function getSiteSettingsApi() {
  return requestClient.get<SiteSettingsApi.Settings>('/admin/site-settings');
}

export async function updateSiteSettingsApi(
  data: SiteSettingsApi.UpdateParams,
) {
  return requestClient.post<SiteSettingsApi.Settings>(
    '/admin/site-settings/update',
    data,
  );
}

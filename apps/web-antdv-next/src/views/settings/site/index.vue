<script lang="ts" setup>
import type { SiteSettingsApi } from '#/api/core/site-settings';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Input, message, Spin } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  getSiteSettingsApi,
  updateSiteSettingsApi,
} from '#/api/core/site-settings';
import MarkdownEditor from '#/components/MarkdownEditor.vue';

import { useSiteSettingsFormSchema } from './data';

const loading = ref(true);
const saving = ref(false);
const aboutMarkdown = ref('');
const socialLinks = ref<SiteSettingsApi.SocialLink[]>([]);

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useSiteSettingsFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

async function loadSettings() {
  loading.value = true;
  try {
    const data = await getSiteSettingsApi();
    formApi.setValues({
      name: data.name,
      description: data.description,
      logo: data.logo,
      icp: data.icp,
    });
    aboutMarkdown.value = data.about ?? '';
    socialLinks.value = (data.socialLinks ?? []).map((item) => ({
      name: item.name,
      url: item.url,
    }));
    if (socialLinks.value.length === 0) {
      socialLinks.value.push({ name: '', url: '' });
    }
  } finally {
    loading.value = false;
  }
}

function addSocialLink() {
  socialLinks.value.push({ name: '', url: '' });
}

function removeSocialLink(index: number) {
  if (socialLinks.value.length <= 1) {
    socialLinks.value[0] = { name: '', url: '' };
    return;
  }
  socialLinks.value.splice(index, 1);
}

async function buildPayload(): Promise<SiteSettingsApi.UpdateParams> {
  const values = await formApi.getValues<Record<string, string>>();
  const links = socialLinks.value
    .map((item) => ({
      name: item.name.trim(),
      url: item.url.trim(),
    }))
    .filter((item) => item.name || item.url);

  return {
    name: String(values.name ?? '').trim(),
    description: String(values.description ?? '').trim(),
    logo: String(values.logo ?? '').trim(),
    icp: String(values.icp ?? '').trim(),
    about: aboutMarkdown.value,
    socialLinks: links,
  };
}

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }

  const payload = await buildPayload();
  for (const link of payload.socialLinks) {
    if (!link.name || !link.url) {
      message.warning('社交链接的名称与地址需成对填写');
      return;
    }
  }

  saving.value = true;
  try {
    await updateSiteSettingsApi(payload);
    message.success('站点设置已保存');
    await loadSettings();
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadSettings();
});
</script>

<template>
  <Page auto-content-height title="站点设置">
    <Card class="max-w-5xl">
      <Spin :spinning="loading">
        <p class="mb-4 text-sm text-neutral-500">
          配置博客前台展示的站点名称、Logo、备案号与社交链接（数据写入
          siteSettings）。
        </p>

        <Form />

        <div class="mt-8">
          <div class="mb-3">
            <span class="text-sm font-medium text-foreground">
              关于页（Markdown）
            </span>
            <p class="mt-1 text-xs text-neutral-500">
              博客前台「关于」页面展示的内容，支持标题、列表、链接、代码块等常见
              Markdown 语法。
            </p>
          </div>
          <MarkdownEditor v-model="aboutMarkdown" :height="480" />
        </div>

        <div class="mt-8">
          <div class="mb-3 flex items-center justify-between gap-2">
            <span class="text-sm font-medium text-foreground">社交链接</span>
            <Button size="small" type="dashed" @click="addSocialLink">
              添加链接
            </Button>
          </div>

          <ul class="list-none space-y-3 p-0">
            <li
              v-for="(link, index) in socialLinks"
              :key="index"
              class="flex flex-col gap-2 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-start"
            >
              <Input
                v-model:value="link.name"
                class="sm:flex-1"
                placeholder="名称，如 github"
              />
              <Input
                v-model:value="link.url"
                class="sm:flex-[2]"
                placeholder="https://..."
              />
              <Button
                danger
                type="text"
                aria-label="删除该链接"
                @click="removeSocialLink(index)"
              >
                删除
              </Button>
            </li>
          </ul>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <Button :disabled="loading" @click="loadSettings"> 重置 </Button>
          <Button :loading="saving" type="primary" @click="onSubmit">
            保存
          </Button>
        </div>
      </Spin>
    </Card>
  </Page>
</template>

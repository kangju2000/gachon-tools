import { defineManifest } from '@crxjs/vite-plugin'

import packageJson from './package.json'
import { UNIVERSITY_LINK_LIST } from './src/constants/univ'

const [major, minor, patch, label = '0'] = packageJson.version.replace(/[^\d.-]+/g, '').split(/[.-]/)

const isDev = process.env.NODE_ENV === 'development'

export default defineManifest(
  async () =>
    ({
      manifest_version: 3,
      name: isDev
        ? '[DEV] Gachon Tools - 과제 대시보드 · 사이버캠퍼스 어시스턴트'
        : 'Gachon Tools - 과제 대시보드 · 사이버캠퍼스 어시스턴트',
      description: packageJson.description,
      version: label === '0' ? `${major}.${minor}.${patch}` : `${major}.${minor}.${patch}.${label}`,
      version_name: packageJson.version,
      action: {
        default_title: 'popup',
        default_popup: 'src/popup/index.html',
        default_icon: {
          '16': 'assets/logo16.png',
          '48': 'assets/logo48.png',
          '128': 'assets/logo128.png',
        },
      },
      icons: {
        '16': 'assets/logo16.png',
        '48': 'assets/logo48.png',
        '128': 'assets/logo128.png',
      },
      background: {
        service_worker: 'src/background/index.ts',
        type: 'module',
      },
      content_scripts: [
        {
          matches: UNIVERSITY_LINK_LIST.map(univ => `${univ}/*`),
          exclude_matches: UNIVERSITY_LINK_LIST.flatMap(univ => [
            `${univ}/login.php*`,
            `${univ}/mod/ubfile/viewer.php*`,
            `${univ}/mod/vod/viewer.php*`,
          ]),
          js: ['src/content/index.tsx'],
          run_at: 'document_start',
        },
      ],
      options_page: 'src/options/index.html',
      web_accessible_resources: [
        {
          resources: ['assets/js/*.js', 'assets/css/*.css', '*.webp', '*.png', '*.jpg', '*.jpeg', '*.gif'],
          matches: ['*://*/*'],
        },
      ],
      host_permissions: UNIVERSITY_LINK_LIST.map(univ => `${univ}/*`),
      permissions: ['storage', 'unlimitedStorage', 'scripting', 'activeTab'],
    }) as const,
)

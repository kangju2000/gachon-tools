import { defineManifest } from '@crxjs/vite-plugin'

import packageJson from './package.json'

const [major, minor, patch, label = '0'] = packageJson.version.replace(/[^\d.-]+/g, '').split(/[.-]/)

const isDev = process.env.NODE_ENV === 'development'

export default defineManifest(async env => ({
  manifest_version: 3,
  name: isDev ? '[DEV] Gachon Tools - 사이버캠퍼스 확장프로그램' : 'Gachon Tools - 사이버캠퍼스 확장프로그램',
  description: packageJson.description,
  version: label === '0' ? `${major}.${minor}.${patch}` : `${major}.${minor}.${patch}.${label}`,
  version_name: packageJson.version,
  action: {
    default_title: 'popup',
    default_popup: 'src/popup/index.html',
    default_icon: {
      '16': 'logo16.png',
      '48': 'logo48.png',
      '128': 'logo128.png',
    },
  },
  icons: {
    '16': 'logo16.png',
    '48': 'logo48.png',
    '128': 'logo128.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://cyber.gachon.ac.kr/*'],
      exclude_matches: [
        'https://cyber.gachon.ac.kr/login.php*',
        'https://cyber.gachon.ac.kr/mod/ubfile/viewer.php*',
        'https://cyber.gachon.ac.kr/mod/vod/viewer.php*',
      ],
      js: isDev ? ['src/content/index.dev.tsx'] : ['src/content/index.prod.tsx'],
      run_at: 'document_start',
    },
  ],
  options_page: 'src/options/index.html',
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css'],
      matches: ['*://*/*'],
    },
  ],
  host_permissions: ['https://cyber.gachon.ac.kr/*'],
  permissions: ['storage', 'scripting', 'activeTab'],
}))

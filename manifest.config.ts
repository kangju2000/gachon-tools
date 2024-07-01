import { defineManifest } from '@crxjs/vite-plugin'

import packageJson from './package.json'
const { version } = packageJson

const [major, minor, patch, label = '0'] = version.replace(/[^\d.-]+/g, '').split(/[.-]/)

export default defineManifest(async env => ({
  manifest_version: 3,
  name:
    env.mode === 'staging'
      ? '[INTERNAL] Hongik Tools - 홍익대학교 확장프로그램'
      : 'Hongik Tools - 홍익대학교 확장프로그램',
  description: '홍익대학교 확장프로그램',
  version: label === '0' ? `${major}.${minor}.${patch}` : `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  action: {
    default_title: 'popup',
    default_popup: 'src/pages/popup/index.html',
  },
  icons: {
    '16': 'chatbot_image.png',
    '48': 'chatbot_image.png',
    '128': 'chatbot_image.png',
  },
  background: {
    service_worker: 'src/pages/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://www.hongik.ac.kr/*'],
      exclude_matches: [
        //
      ],
      js: ['src/pages/content/main.tsx'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css'],
      matches: ['*://*/*'],
    },
  ],
  host_permissions: ['https://www.hongik.ac.kr/*'],
  options_page: 'src/pages/options/index.html',
  permissions: ['storage', 'scripting', 'activeTab'],
}))

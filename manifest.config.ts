import { defineManifest } from '@crxjs/vite-plugin';

import packageJson from './package.json';
const { version } = packageJson;

const [major, minor, patch, label = '0'] = version.replace(/[^\d.-]+/g, '').split(/[.-]/);

export default defineManifest(async env => ({
  manifest_version: 3,
  name:
    env.mode === 'staging'
      ? '[INTERNAL] Gachon Tools - 사이버캠퍼스 확장프로그램'
      : 'Gachon Tools - 사이버캠퍼스 확장프로그램',
  description: '가천대학교 사이버캠퍼스 확장프로그램',
  version: label === '0' ? `${major}.${minor}.${patch}` : `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  action: {
    default_title: 'popup',
    default_popup: 'src/pages/popup/index.html',
  },
  icons: {
    '16': 'logo16.png',
    '48': 'logo48.png',
    '128': 'logo128.png',
  },
  background: {
    service_worker: 'src/pages/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://cyber.gachon.ac.kr/*'],
      exclude_matches: ['https://cyber.gachon.ac.kr/login.php*'],
      js: ['src/pages/content/main.tsx'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['assets/js/*.js', 'assets/css/*.css'],
      matches: ['*://*/*'],
    },
  ],
  host_permissions: ['https://cyber.gachon.ac.kr/*'],
  options_page: 'src/pages/options/index.html',
  permissions: ['storage', 'scripting', 'activeTab'],
}));
